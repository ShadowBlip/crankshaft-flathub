import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { cachedCurlBase64, curlBase64 } from '../util/curl';

export interface GridItemProps {
  smm: SMM;
  appId: string;
  img: string;
  text: string;
  onSelect?: (value: string) => Promise<void>;
}

export interface GridItemState {
  selected: boolean;
  imgData: string;
  imgUrl: string;
}

export class GridItem extends Component<GridItemProps, GridItemState> {
  ref = createRef<HTMLDivElement>();
  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }

    // Observe if someone mutates our class
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      // Set the grid item to selected if we see gamepad focus
      if (this.ref.current!.classList.contains('cs-gp-focus')) {
        this.setState({ selected: true });
        return;
      }
      this.setState({ selected: false });
    });
    observer.observe(this.ref.current, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });

    // Fetch and render the grid image
    const imgData = await cachedCurlBase64(this.props.smm, this.props.img);
    this.setState({
      imgData: `data:image/png;base64, ${imgData}`,
      imgUrl: this.props.img,
    });
  }

  // Fetch new images if our URL property changes
  async componentWillReceiveProps(
    nextProps: GridItemProps,
    nextState: GridItemState
  ) {
    const imgData = await cachedCurlBase64(nextProps.smm, nextProps.img);
    this.setState({
      imgData: `data:image/png;base64, ${imgData}`,
      imgUrl: nextProps.img,
    });
  }

  async onClick(e: Event) {
    console.log(`Clicked grid item ${this.props.appId}`);

    const value = this.props.appId;
    if (this.props.onSelect && value) {
      await this.props.onSelect(value);
    }
  }

  render(props: GridItemProps, state: GridItemState) {
    const style = state.selected ? 'border-style: ridge;' : '';
    return (
      <div
        ref={this.ref}
        class="allcollections_Collection_3IWn- Focusable gpfocuswithin"
        data-cs-gp-in-group="flathub-app-list"
        data-cs-gp-item={`flathub-app-list__${props.appId}`}
        onClick={(e: Event) => this.onClick(e)}
        style={style}
        tabIndex={0}
      >
        <div class="allcollections_CollectionImage_2ERAQ allcollections_Has1Apps_3R8nX">
          <div
            class="allcollections_CollectionBG_akZn"
            style="padding-left: 24px; padding-top: 24px"
          >
            <img src={state.imgData} />
          </div>
        </div>
        <div class="allcollections_CollectionLabel_1J1LQ">
          <div>{props.text}</div>
        </div>
      </div>
    );
  }
}
