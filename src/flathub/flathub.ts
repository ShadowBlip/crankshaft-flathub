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
}
