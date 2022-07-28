import { Component, createRef, RefObject } from 'preact';
import { Flathub } from '../flathub/flathub';
import { FlathubAppEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { cachedCurlBase64, curlBase64 } from '../util/curl';
import { InstallButton } from './install';

export interface AppInfoProps {
  smm: SMM;
  appId: string;
}

export interface AppInfoState {
  info: FlathubAppEntry;
  imgData: string;
  isInstalled: boolean;
  isInstalling: boolean;
}

export class AppInfo extends Component<AppInfoProps, AppInfoState> {
  ref = createRef();
  flathub: Flathub;
  constructor(props: AppInfoProps) {
    super(props);
    this.flathub = new Flathub(props.smm);
  }

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    await this.update(this.props, this.state);
  }

  async componentWillReceiveProps(
    nextProps: AppInfoProps,
    nextState: AppInfoState
  ) {
    await this.update(nextProps, nextState);
  }

  // Fetch the app information for the given flatpak
  async update(props: AppInfoProps, state: AppInfoState) {
    // Fetch the app info
    const appId = props.appId;
    const info = await this.flathub.getAppInfo(appId);
    const imgData = await cachedCurlBase64(props.smm, info.iconMobileUrl);

    // Check to see if the given app is already installed.
    const isInstalled = await this.flathub.isInstalled(appId);
    this.setState({
      info: info,
      imgData: `data:image/png;base64, ${imgData}`,
      isInstalled: isInstalled,
    });
  }

  // Gets called when the install button is clicked
  async onAction(value: string) {
    // Only action on install/uninstall
    if (!['Install', 'Uninstall'].includes(value)) {
      return;
    }

    // Fetch the app info
    const appId = this.state.info.flatpakAppId;
    const appInfo = await this.flathub.getAppInfo(appId);

    // Get the plugin state directory
    const pluginsDir = await this.props.smm.FS.getPluginsPath();
    const stateDir = `${pluginsDir}/crankshaft-flathub/.state`;

    // Handle install action
    if (value === 'Install') {
      console.log(`Installing ${appId}...`);
      this.props.smm.Toast.addToast(`Installing ${appId}...`, 'info', {
        timeout: 10000,
      });
      this.setState({ isInstalling: true });
      const out = await this.flathub.install(appId);
      this.setState({ isInstalling: false });

      // Ensure flatpak install succeeded
      if (out.exitCode !== 0) {
        console.log(out);
        this.props.smm.Toast.addToast(
          `Error installing ${appId}: ${out.stderr}`,
          'error'
        );
        return;
      }

      // Add the installed flatpak as a library shortcut
      await this.flathub.addShortcut(appId, appInfo.name);

      // Re-render after installing
      await this.update(this.props, this.state);
      this.props.smm.Toast.addToast(
        `${appInfo.name} installed successfully. Please restart Steam.`,
        'success'
      );
      return;
    }

    // Handle uninstall action
    console.log(`Uninstalling ${appId}...`);
    this.props.smm.Toast.addToast(`Uninstalling ${appId}...`, 'info');
    const out = await this.flathub.uninstall(appId);

    // Ensure flatpak install succeeded
    if (out.exitCode !== 0) {
      console.log(out);
      this.props.smm.Toast.addToast(
        `Error uninstalling ${appId}: ${out.stderr}`,
        'error'
      );
      return;
    }

    // Add the installed flatpak as a library shortcut
    await this.flathub.removeShortcut(appInfo.name);

    // Re-render after installing
    await this.update(this.props, this.state);
    this.props.smm.Toast.addToast(
      `${appInfo.name} uninstalled successfully. Please restart Steam.`,
      'success'
    );
  }

  getTitle(state: AppInfoState) {
    // Set the button text based on state
    let buttonText = state.isInstalled ? 'Uninstall' : 'Install';
    if (state.isInstalling) {
      if (buttonText === 'Install') {
        buttonText = 'Installing...';
      } else {
        buttonText = 'Uninstalling...';
      }
    }
    return (
      <div class="partnereventdisplay_LibraryEventTitleContainer_2gdgU">
        <div class="partnereventdisplay_EventDetailTitleContainer_35gM9">
          <div class="basicpartnereventspage_GameIconAndName_3R5H5">
            <div class="libraryassetimage_Container_1R9r2 libraryassetimage_GreyBackground_2E7G8 ">
              <img
                src={state.imgData}
                style="width:32px;height:32px;"
                class="libraryassetimage_Image_24_Au libraryassetimage_Visibility_3d_bT libraryassetimage_Visible_yDr03"
                alt={state.info.flatpakAppId}
              />
            </div>
            <div>{state.info.flatpakAppId}</div>
            <InstallButton
              text={buttonText}
              onSelect={(value: string) => this.onAction(value)}
            />
          </div>
          <div class="apppartnereventspage_EventTypeAndTimeRow_11C0z">
            <div class="apppartnereventspage_TimeandPostedBy_ElEkK">
              <span class="apppartnereventspage_EventType_30JUM">
                {state.info.summary}
              </span>
              <span class="apppartnereventspage_PostedBy_3GBGA">
                by {state.info.developerName}
              </span>
              <div class="partnereventdisplay_EventDetailTimeInfo_3Z41s">
                <div class="Focusable">
                  <div class="localdateandtime_ShortDateAndTime_4K3Bl">
                    {state.info.developerName}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="partnereventdisplay_EventDetailTitle_2_4FS">
            {state.info.name}
          </div>
          <div class="partnereventdisplay_EventDetailUserType_3xnQd"></div>
        </div>
      </div>
    );
  }

  getBody(info: FlathubAppEntry) {
    return (
      <div class="partnereventdisplay_LibraryEventBodyContainer_2ZgLv">
        <div class="partnereventdisplay_EventDetailsBody_3v0cw apppartnereventspage_EventDetailsBody_AWjK8">
          <div dangerouslySetInnerHTML={{ __html: info.description }} />
          <span class="partnereventshared_Clear_2BXhG"></span>
        </div>
      </div>
    );
  }

  render(props: AppInfoProps, state: AppInfoState) {
    const title = state.info ? this.getTitle(state) : <div></div>;
    const body = state.info ? this.getBody(state.info) : <div></div>;
    return (
      <div
        ref={this.ref}
        class="basicpartnereventspage_BasicPartnerEvent_2yuwU apppartnereventspage_PartnerEvent_lwprN partnereventdisplay_InLibraryView_3X6U9"
      >
        <img src="" class="partnereventdisplay_EventBackgroundBlur_eti5E" />
        {title}
        {body}
      </div>
    );
  }
}
