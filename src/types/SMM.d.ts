import { InGameMenu } from './in-game-menu';
import { MenuManager } from './menu-manager';
import { Exec } from './services/Exec';
import { FS } from './services/FS';
import { IPC } from './services/IPC';
import { Network } from './services/Network';
import { Plugins } from './services/Plugins';
import { Toast } from './services/Toast';
import { UI } from './services/ui';
declare type PluginId = string;
export declare type Entry = 'library' | 'menu' | 'quickAccess';
export declare class SMM extends EventTarget {
  readonly entry: Entry;
  private _currentTab?;
  private _currentAppId?;
  private _currentAppName?;
  private _onLockScreen;
  readonly Network: Network;
  readonly Toast: Toast;
  readonly MenuManager: MenuManager;
  readonly InGameMenu: InGameMenu;
  readonly FS: FS;
  readonly Plugins: Plugins;
  readonly IPC: IPC;
  readonly UI: UI;
  readonly Exec: Exec;
  readonly serverPort: string;
  private currentPlugin?;
  private attachedEvents;
  constructor(entry: Entry);
  get currentTab(): 'home' | 'collections' | 'appDetails' | undefined;
  get currentAppId(): string | undefined;
  get onLockScreen(): boolean;
  switchToUnknownPage(): void;
  switchToHome(): void;
  switchToCollections(): void;
  switchToAppDetails(appId: string, appName: string): void;
  lockScreenOpened(): void;
  lockScreenClosed(): void;
  loadPlugins(): Promise<void>;
  loadPlugin(pluginId: PluginId): Promise<void>;
  unloadPlugin(pluginId: PluginId): Promise<void>;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void;
}
export {};
