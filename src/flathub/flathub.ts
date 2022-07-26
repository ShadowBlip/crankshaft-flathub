import { SMM } from '../types/SMM';
import { boilerConfig } from '../util/boilr';

import { FlathubAppEntry, FlathubSearchEntry, FlatpakEntry } from './model';

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

  public async addShortcuts() {
    // Set boilr config
    // TODO: Can we change this?
    // f092e3045f4f041c4bf8a9db2cb8c25c

    const homeDir = await this.getHomeDir();
    const boilerConfDir = `${homeDir}/.config/boilr`;
    await this.smm.FS.mkDir(boilerConfDir, true);
    await this.smm.Exec.run('bash', [
      '-c',
      `cp ${boilerConfDir}/config.toml ${boilerConfDir}/config.toml.bak`,
    ]);
    await this.smm.Exec.run('bash', [
      '-c',
      `echo -e '${boilerConfig}' > ${boilerConfDir}/config.toml`,
    ]);

    // Execute boilr to add shortcuts
    const pluginsDir = await this.smm.FS.getPluginsPath();
    const binDir = `${pluginsDir}/crankshaft-flathub/bin`;
    const out = await this.smm.Exec.run(`${binDir}/boilr`, ['--no-ui']);
    console.log(out);

    // Restore original boilr config
    await this.smm.Exec.run('bash', [
      '-c',
      `cp ${boilerConfDir}/config.toml.bak ${boilerConfDir}/config.toml`,
    ]);
  }

  public async addShortcut(appId: string, name: string) {
    // DISPLAY=:0 steamtinkerlaunch addnonsteamgame --appname=Spotify --exepath=/usr/bin/flatpak --startdir=/home --launchoptions "run com.spotify.Client"
    const homeDir = await this.getHomeDir();
    const steamtinkerlaunch = 'steamtinkerlaunch';
    const cmd = [
      'DISPLAY=:0',
      steamtinkerlaunch,
      'addnonsteamgame',
      `--appname=${name.replace(' ', '\\ ')}`,
      `--exepath=/usr/bin/flatpak`,
      `--startdir=${homeDir.replace(' ', '\\ ')}`,
      `--launchoptions=run\\ ${appId}`,
    ];
    console.log(`Adding Steam shortcut for: ${appId}`);
    console.log(cmd);
    const out = await this.smm.Exec.run('bash', ['-c', cmd.join(' ')]);
    console.log(out);
  }

  async getHomeDir(): Promise<string> {
    const out = await this.smm.Exec.run('bash', ['-c', 'echo $HOME']);
    const homeDir = out.stdout;

    return homeDir;
  }
}
