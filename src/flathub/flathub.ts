import { SMM } from '../types/SMM';
import { boilerConfig } from '../util/boilr';

import { FlathubAppEntry, FlathubSearchEntry, FlatpakEntry } from './model';

// TODO: Run flathub repair --user
// flatpak remote-add --user --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
// flatpak remote-add --user --if-not-exists flathub-beta https://flathub.org/beta-repo/flathub-beta.flatpakrepo

export class Flathub {
  smm: SMM;
  constructor(smm: SMM) {
    this.smm = smm;
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

  // Returns whether or not the given app is installed.
  public async isInstalled(appId: string): Promise<boolean> {
    return (await this.getInstalled()).includes(appId);
  }

  // Installs the given flatpak
  public async install(
    appId: string
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return await this.smm.Exec.run('flatpak', [
      '--user',
      'install',
      '-y',
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

  public async addShortcut(appId: string, name: string) {
    // await SteamClient.Apps.AddShortcut('Spotify', '"/usr/bin/flatpak"')
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

  public async removeShortcut(name: string) {
    // Get the path to the shortcut manager binary
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const shortcutMgr = `${pluginsDir}/crankshaft-flathub/bin/steam-shortcut-manager`;

    // Execute the shortcut manager
    const args = ['remove', name];
    console.log(`Removing Steam shortcut for: ${name}`);
    const out = await this.smm.Exec.run(shortcutMgr, args);
    console.log(out);
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', ['-c', 'echo $HOME']);
    const homeDir = out.stdout;

    return homeDir;
  }
}
