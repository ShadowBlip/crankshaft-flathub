import { SMM } from '../types/SMM';
import { FlatpakEntry } from './model';

export class Flathub {
  smm: SMM;
  constructor(smm: SMM) {
    this.smm = smm;
  }

  public async getPopular(): Promise<FlatpakEntry[]> {
    const url = 'https://flathub.org/api/v1/apps/collection/popular';
    const entries = await this.smm.Network.get<FlatpakEntry[]>(url);
    return entries;
  }
}
