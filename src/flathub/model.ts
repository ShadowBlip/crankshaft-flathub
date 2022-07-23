export interface FlatpakEntry {
  flatpakAppId: string;
  name: string;
  summary: string;
  iconDesktopUrl: string;
  iconMobileUrl: string;
  currentReleaseVersion: any;
  currentReleaseDate: Date;
  inStoreSinceDate: Date;
}
