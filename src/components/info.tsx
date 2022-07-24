import { Component, createRef, RefObject } from 'preact';
import { Flathub } from '../flathub/flathub';
import { FlathubAppEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { cachedCurlBase64, curlBase64 } from '../util/curl';

export interface AppInfoProps {
  smm: SMM;
  appId: string;
}

export interface AppInfoState {
  info: FlathubAppEntry;
  imgData: string;
}

const installDiv = () => {
  return (
    <div style="margin-left: auto; margin-right: 0;">
      <div
        class="appactionbutton_PlayButton_3ydig appactionbutton_ButtonChild_2AzIX Focusable gpfocus gpfocuswithin"
        style="display: flex; justify-content: flex-end;"
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29 23V27H7V23H2V32H34V23H29Z"
            fill="currentColor"
          ></path>
          <svg x="0" y="0" width="32" height="25">
            <path
              class="DownloadArrow"
              d="M20 14.1716L24.5858 9.58578L27.4142 12.4142L18 21.8284L8.58582 12.4142L11.4142 9.58578L16 14.1715V2H20V14.1716Z"
              fill="currentColor"
            ></path>
          </svg>
        </svg>
        <div class="appactionbutton_ButtonText_33cnX">Install</div>
      </div>
    </div>
  );
};

const titleDiv = (info: FlathubAppEntry, img: string) => {
  const installButton = installDiv();
  return (
    <div class="partnereventdisplay_LibraryEventTitleContainer_2gdgU">
      <div class="partnereventdisplay_EventDetailTitleContainer_35gM9">
        <div class="basicpartnereventspage_GameIconAndName_3R5H5">
          <div class="libraryassetimage_Container_1R9r2 libraryassetimage_GreyBackground_2E7G8 ">
            <img
              src={img}
              style="width:32px;height:32px;"
              class="libraryassetimage_Image_24_Au libraryassetimage_Visibility_3d_bT libraryassetimage_Visible_yDr03"
              alt={info.flatpakAppId}
            />
          </div>
          <div>{info.flatpakAppId}</div>
          {installButton}
        </div>
        <div class="apppartnereventspage_EventTypeAndTimeRow_11C0z">
          <div class="apppartnereventspage_TimeandPostedBy_ElEkK">
            <span class="apppartnereventspage_EventType_30JUM">
              {info.summary}
            </span>
            <span class="apppartnereventspage_PostedBy_3GBGA">
              by {info.developerName}
            </span>
            <div class="partnereventdisplay_EventDetailTimeInfo_3Z41s">
              <div class="Focusable">
                <div class="localdateandtime_ShortDateAndTime_4K3Bl">
                  {info.developerName}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="partnereventdisplay_EventDetailTitle_2_4FS">
          {info.name}
        </div>
        <div class="partnereventdisplay_EventDetailUserType_3xnQd"></div>
      </div>
    </div>
  );
};

const bodyDiv = (info: FlathubAppEntry) => {
  return (
    <div class="partnereventdisplay_LibraryEventBodyContainer_2ZgLv">
      <div class="partnereventdisplay_EventDetailsBody_3v0cw apppartnereventspage_EventDetailsBody_AWjK8">
        <div dangerouslySetInnerHTML={{ __html: info.description }} />
        <span class="partnereventshared_Clear_2BXhG"></span>
      </div>
    </div>
  );
};

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
    const appId = this.props.appId;
    const info = await this.flathub.getAppInfo(appId);
    const imgData = await cachedCurlBase64(this.props.smm, info.iconMobileUrl);
    this.setState({ info: info, imgData: `data:image/png;base64, ${imgData}` });
  }

  // Fetch the app information for the given flatpak
  async componentWillReceiveProps(
    nextProps: AppInfoProps,
    nextState: AppInfoState
  ) {
    const appId = nextProps.appId;
    const info = await this.flathub.getAppInfo(appId);
    const imgData = await cachedCurlBase64(nextProps.smm, info.iconMobileUrl);
    this.setState({ info: info, imgData: `data:image/png;base64, ${imgData}` });
  }

  render(props: AppInfoProps, state: AppInfoState) {
    const title = state.info ? (
      titleDiv(state.info, state.imgData)
    ) : (
      <div></div>
    );
    const body = state.info ? bodyDiv(state.info) : <div></div>;
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
