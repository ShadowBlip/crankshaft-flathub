import { Component, createRef, RefObject } from 'preact';
import { flathubLogo } from '../assets/logos';
import { Flathub } from '../flathub/flathub';
import { FlatpakEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { GridItem } from './grid';
import { AppInfo } from './info';
import { SearchBar } from './search';

export interface HomeProps {
  smm: SMM;
}

export interface HomeState {
  entries: FlatpakEntry[];
  currentApp: string;
}

export class Home extends Component<HomeProps, HomeState> {
  ref = createRef<HTMLDivElement>();
  flathub: Flathub;
  constructor(props: HomeProps) {
    super(props);
    this.flathub = new Flathub(props.smm);
  }

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    const entries = (await this.flathub.getPopular()).filter(
      (entry) => entry.flatpakAppId !== 'com.valvesoftware.Steam'
    );
    this.setState({ entries: entries });
  }

  async onSearch(value: string) {
    // Reset UI if search filter is empty
    if (value === '') {
      return await this.componentDidMount();
    }

    // Do nothing until we have at least 3 characters
    if (value.length <= 3) {
      return;
    }

    // Search Flathub for the given query
    console.log(`Searching for '${value}'`);
    const results = await this.flathub.search(value);
    const entries = results.map(
      (result) =>
        ({
          flatpakAppId: result.id,
          name: result.name,
          summary: result.summary,
          iconMobileUrl: result.icon,
        } as FlatpakEntry)
    );
    this.setState({ entries: entries, currentApp: this.state.currentApp });
  }

  // Invoked when a grid item was selected
  async onAppSelect(value: string) {
    // Scroll to the top
    this.ref.current?.scrollIntoView();
    // Set the current app to display the app info
    this.setState({ entries: this.state.entries, currentApp: value });
  }

  render(props: HomeProps, state: HomeState) {
    const entries = state.entries ? state.entries : [];
    const currentApp = state.currentApp ? (
      <AppInfo smm={props.smm} appId={state.currentApp} />
    ) : (
      <div></div>
    );
    return (
      <div
        class="BasicUI GamepadMode gamepadui_BasicUiRoot_bo6E MediumWindow"
        style="--basicui-header-height:40px;"
        ref={this.ref}
      >
        <SearchBar
          smm={props.smm}
          onInputChange={(value: string) => this.onSearch(value)}
        />
        <div
          id="FlathubMain"
          class="gamepadui_Content_1FxmN Panel Focusable gpfocuswithin"
          style="padding-top: 42px"
        >
          {currentApp}
          <div class="Panel Focusable gpfocuswithin">
            <div>
              <img
                src={`data:image/png;base64, ${flathubLogo}`}
                style="display: block; margin-left: auto; margin-right: auto; padding: 10px;"
              />
            </div>
            <div
              class="cssgrid_Container_DGRkX Panel Focusable gpfocuswithin"
              style="padding-left: 38px;"
            >
              <div
                class="cssgrid_CSSGrid_3vHkm allcollections_Grid_Ma65K Panel Focusable gpfocuswithin"
                style="grid-template-columns: repeat(auto-fill, 170px); grid-auto-rows: 185px; gap: 22px; font-size: 16.8182px; paddding-left: 0px; padding-right: 0px;"
              >
                {entries.map((entry) => (
                  <GridItem
                    smm={props.smm}
                    img={entry.iconMobileUrl}
                    text={entry.name}
                    appId={entry.flatpakAppId}
                    onSelect={(value: string) => this.onAppSelect(value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
