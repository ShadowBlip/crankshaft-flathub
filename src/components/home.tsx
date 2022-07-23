import { Component, createRef, RefObject } from 'preact';
import { flathubLogo } from '../assets/logos';
import { Flathub } from '../flathub/flathub';
import { FlatpakEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { GridItem } from './grid';
import { SearchBar } from './search';

export interface HomeProps {
  smm: SMM;
}

export interface HomeState {
  entries: FlatpakEntry[];
}

export class Home extends Component<HomeProps, HomeState> {
  ref = createRef();
  flathub: Flathub;
  constructor(props: HomeProps) {
    super(props);
    this.flathub = new Flathub(props.smm);
  }

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    const entries = await this.flathub.getPopular();
    this.setState({ entries: entries });
  }

  render(props: HomeProps) {
    const entries = this.state.entries ? this.state.entries : [];
    return (
      <div
        class="BasicUI GamepadMode gamepadui_BasicUiRoot_bo6E MediumWindow"
        style="--basicui-header-height:40px;"
        ref={this.ref}
      >
        <SearchBar smm={props.smm} />
        <div
          id="FlathubMain"
          class="gamepadui_Content_1FxmN Panel Focusable gpfocuswithin"
          style="padding-top: 42px"
        >
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
