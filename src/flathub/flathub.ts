import { SMM } from '../types/SMM';
import { FlathubAppEntry, FlatpakEntry, FlathubSearchEntry } from './model';

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
}
