import { hasChimera } from '../chimera/chimera';
import { SMM } from '../types/SMM';

import { FlathubAppEntry, FlathubSearchEntry, FlatpakEntry } from './model';

export class Flathub {
  smm: SMM;
  constructor(smm: SMM) {
    this.smm = smm;
  }

  public async setup(): Promise<void> {
    let out = await this.smm.Exec.run('flatpak', ['repair', '--user']);
    console.log(out);
    out = await this.smm.Exec.run('flatpak', [
      'remote-add',
      '--user',
      '--if-not-exists',
      'flathub',
      'https://flathub.org/repo/flathub.flatpakrepo',
    ]);
    console.log(out);
    out = await this.smm.Exec.run('flatpak', [
      'remote-add',
      '--user',
      '--if-not-exists',
      'flathub-beta',
      'https://flathub.org/beta-repo/flathub-beta.flatpakrepo',
    ]);
    console.log(out);
  }

  public async getPopular(): Promise<FlatpakEntry[]> {
    const url = 'https://flathub.org/api/v1/apps/collection/popular';
    return await this.smm.Network.get<FlatpakEntry[]>(url);
  }

  public async search(str: string): Promise<FlathubSearchEntry[]> {
    const url = `https://flathub.org/api/v2/search/${str}`;
    return await this.smm.Network.get<FlathubSearchEntry[]>(url);
  }

  public async getAppInfo(appId: string): Promise<FlathubAppEntry> {
    const url = `https://flathub.org/api/v1/apps/${appId}`;
    return await this.smm.Network.get<FlathubAppEntry>(url);
  }

  // Returns a list of installed flatpaks
  public async getInstalled(): Promise<string[]> {
    const out = await this.smm.Exec.run('flatpak', [
      '--user',
      'list',
      '--app',
      '--columns=application',
    ]);
    const appIds = out.stdout
      .split('\n')
      .filter((appId) => appId !== 'Application ID');
    console.log(appIds);
    return appIds;
  }

  // Returns a list of installed flatpaks that have updates
  public async getUpdates(): Promise<string[]> {
    const out = await this.smm.Exec.run('flatpak', [
      '--user',
      'remote-ls',
      '--app',
      '--updates',
      '--columns=application',
    ]);
    const appIds = out.stdout
      .split('\n')
      .filter((appId) => appId !== 'Application ID');
    console.log(appIds);
    return appIds;
  }

  // Returns whether or not the given app is installed.
  public async isInstalled(appId: string): Promise<boolean> {
    return (await this.getInstalled()).includes(appId);
  }

  // Returns whether or not the given app has updates
  public async hasUpdates(appId: string): Promise<boolean> {
    return (await this.getUpdates()).includes(appId);
  }

  // Installs the given flatpak
  public async install(
    appId: string
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return await this.smm.Exec.run('flatpak', [
      '--user',
      'install',
      '-y',
      'flathub',
      appId,
    ]);
  }

  // Uninstalls the given flatpak
  public async uninstall(
    appId: string
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return await this.smm.Exec.run('flatpak', [
      '--user',
      'uninstall',
      '-y',
      appId,
    ]);
  }

  // Updates the given flatpak
  public async update(
    appId: string
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return await this.smm.Exec.run('flatpak', [
      '--user',
      'update',
      '-y',
      appId,
    ]);
  }

  public async downloadArtwork(shortcutAppId: string, name: string) {
    // Get the path to the shortcut manager binary
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const shortcutMgr = `${pluginsDir}/crankshaft-flathub/bin/steam-shortcut-manager`;

    // Execute the shortcut manager to add a steam shortcut
    const args = [
      'steamgriddb',
      'download',
      '--api-key',
      'f092e3045f4f041c4bf8a9db2cb8c25c',
      '--app-id',
      shortcutAppId,
      name,
    ];
    console.log(`Downloading artwork for ${name}`);
    const out = await this.smm.Exec.run(shortcutMgr, args);
    console.log(out);
  }

  // Add a Steam shortcut to Steam library
  public async addShortcut(appId: string, name: string) {
    // Detect whether or not there is a Chimera installation. Chimera handles
    // shortcut creation in Steam and stomps over anything else.
    if (await hasChimera(this.smm)) {
      await this.addChimeraShortcut(appId, name);
      return;
    }
    await this.addSteamShortcut(appId, name);
  }

  // Adds a steam shortcut directly to Steam.
  public async addSteamShortcut(appId: string, name: string) {
    // Get the path to the shortcut manager binary
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const shortcutMgr = `${pluginsDir}/crankshaft-flathub/bin/steam-shortcut-manager`;

    // Execute the shortcut manager to add a steam shortcut
    const args = [
      'add',
      name,
      '"/usr/bin/flatpak"',
      '--flatpak-id',
      appId,
      '--launch-options',
      `run --user ${appId}`,
      '--download-images',
      '--api-key',
      'f092e3045f4f041c4bf8a9db2cb8c25c',
    ];
    console.log(`Adding Steam shortcut for: ${appId}`);
    const out = await this.smm.Exec.run(shortcutMgr, args);
    console.log(out);
  }

  // Adds a Chimera shortcut, which manages Steam shortcuts for us.
  public async addChimeraShortcut(appId: string, name: string) {
    // Get the path to the shortcut manager binary
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const shortcutMgr = `${pluginsDir}/crankshaft-flathub/bin/steam-shortcut-manager`;

    // Execute the shortcut manager to add a steam shortcut
    const args = [
      'chimera',
      'add',
      name,
      `flatpak run --user ${appId}`,
      '--flatpak-id',
      appId,
      '--tags',
      'ChimeraOS Playable',
      '--tags',
      'Flathub',
      '--download-images',
      '--api-key',
      'f092e3045f4f041c4bf8a9db2cb8c25c',
      '-o',
      'json',
    ];
    console.log(`Adding Chimera shortcut for: ${appId}`);
    const out = await this.smm.Exec.run(shortcutMgr, args);
    console.log(out);
  }

  public async removeShortcut(name: string) {
    // Get the path to the shortcut manager binary
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const shortcutMgr = `${pluginsDir}/crankshaft-flathub/bin/steam-shortcut-manager`;

    // Execute the shortcut manager
    const isChimera = await hasChimera(this.smm);
    const args = isChimera ? ['chimera', 'remove', name] : ['remove', name];
    console.log(`Removing shortcut for: ${name}`);
    const out = await this.smm.Exec.run(shortcutMgr, args);
    console.log(out);
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', ['-c', 'echo $HOME']);
    const homeDir = out.stdout;

    return homeDir;
  }
}
