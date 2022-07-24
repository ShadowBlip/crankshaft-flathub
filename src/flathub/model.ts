export interface FlatpakEntry {
  flatpakAppId: string;
  name: string;
  summary: string;
  iconDesktopUrl?: string;
  iconMobileUrl: string;
  currentReleaseVersion?: any;
  currentReleaseDate?: Date;
  inStoreSinceDate?: Date;
}

export interface FlathubSearchEntry {
  id: string;
  name: string;
  summary: string;
  icon: string;
}

export interface FlathubAppEntry {
  flatpakAppId: string;
  name: string;
  summary: string;
  description: string;
  downloadFlatpakRefUrl: string;
  projectLicense: string;
  iconDesktopUrl: string;
  iconMobileUrl: string;
  homepageUrl: string;
  helpUrl: any;
  translateUrl: any;
  bugtrackerUrl: any;
  donationUrl: any;
  developerName: string;
  categories: Category[];
  currentReleaseDescription: any;
  currentReleaseVersion: string;
  currentReleaseDate: string;
  inStoreSinceDate: string;
  screenshots: Screenshot[];
}

export interface Category {
  name: string;
}

export interface Screenshot {
  imgDesktopUrl: string;
  imgMobileUrl: string;
  thumbUrl: string;
}
