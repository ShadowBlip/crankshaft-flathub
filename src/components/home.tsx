import { Component, createRef, RefObject } from 'preact';
import { Flathub } from '../flathub/flathub';
import { FlatpakEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { curl, curlBase64 } from '../util/curl';

export interface GridItemProps {
  smm: SMM;
  img: string;
  text: string;
}

export interface GridItemState {
  img: string;
}

export class GridItem extends Component<GridItemProps, GridItemState> {
  ref = createRef();
  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    const imgData = await curlBase64(this.props.smm, this.props.img);
    this.setState({ img: `data:image/png;base64, ${imgData}` });
  }

  render(props: any) {
    return (
      <div
        ref={this.ref}
        class="allcollections_Collection_3IWn- Focusable gpfocuswithin"
        tabIndex={0}
      >
        <div class="allcollections_CollectionImage_2ERAQ allcollections_Has1Apps_3R8nX">
          <img src={this.state.img} />
        </div>
        <div class="allcollections_CollectionLabel_1J1LQ">
          <div>{props.text}</div>
        </div>
      </div>
    );
  }
}

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

  // Fetches the image for the flatpak entry.
  async getImage(entry: FlatpakEntry): Promise<string> {
    return curlBase64(this.props.smm, entry.iconMobileUrl);
  }

  render(props: HomeProps) {
    const entries = this.state.entries ? this.state.entries : [];
    return (
      <div ref={this.ref}>
        Welcome!
        <div class="Panel Focusable gpfocuswithin">
          <div class="gamepadtabbedpage_TabContentsScroll_1X4dt srollpanel_ScrollPanel_1CXdi scrollpanel_ScrollY_313lB Panel Focusable gpfocuswithin">
            <div class="Panel Focusable gpfocuswithin">
              <div class="cssgrid_Container_DGRkX Panel Focusable gpfocuswithin">
                <div
                  class="cssgrid_CSSGrid_3vHkm allcollections_Grid_Ma65K Panel Focusable gpfocuswithin"
                  style="grid-template-columns: repeat(auto-fill, 185px); grid-auto-rows: 185px; gap: 22px; font-size: 16.8182px; paddding-left: 0px; padding-right: 0px;"
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
      </div>
    );
  }
}
