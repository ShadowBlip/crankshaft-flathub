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

    // Ensure flathub repos are setup
    this.flathub.setup();

    // NOTE: Crankshaft puts us under a weird div with padding. Mutate
    // that so we have no padding in our parent.
    const parent = this.ref.current.parentElement as HTMLDivElement;
    parent.style.padding = '0px';

    // TODO: This is a weird hack to move ourselves to the correct place in the
    // DOM in order for the on-screen keyboard to render over us correctly.
    if (window.smmUIMode == 'deck') {
      const steamNavMenu = document.getElementById(
        'MainNavMenu-Rest'
      ) as HTMLDivElement;
      const crankRoot = parent.parentElement as HTMLDivElement;
      crankRoot.style.zIndex = '4';
      steamNavMenu.appendChild(crankRoot);
    }

    // Load the popular entries on load
    const entries = (await this.flathub.getPopular()).filter(
      (entry) => entry.flatpakAppId !== 'com.valvesoftware.Steam'
    );
    this.setState({ entries: entries });
  }

  async componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {
    // Scroll to the top if our current app changed
    if (this.state.currentApp !== prevState.currentApp) {
      this.ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Gets called when the user starts to type in the search field
  async onSearch(value: string) {
    // Reset UI if search filter is empty
    if (value === '') {
      return await this.componentDidMount();
    }

    // Whenever we start searching, clear the app info
    await this.clearCurrentApp();

    // Do nothing until we have at least 2 characters
    if (value.length <= 2) {
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

  // Clears the current app so the UI will remove the AppInfo menu
  async clearCurrentApp() {
    if (!this.state.currentApp) {
      return;
    }
    this.setState({ currentApp: '' });
  }

  // Invoked when a grid item was selected
  async onAppSelect(value: string) {
    // Set the current app to display the app info
    this.setState({ entries: this.state.entries, currentApp: value });

    // Change gmaepad focus to the info panel
    // @ts-ignore
    this.props.smm.activeGamepadHandler.recalculateTree();
    // @ts-ignore
    this.props.smm.activeGamepadHandler.updateFocused('flathub-app-info');
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
        data-cs-gp-in-group="root"
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
