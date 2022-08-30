import { Component, createRef, RefObject } from 'preact';
import { BTN_CODE } from '../deck-components/Gamepad';
import { FlatpakEntry } from '../flathub/model';
import { SMM } from '../types/SMM';
import { cachedCurlBase64, curlBase64 } from '../util/curl';

export interface GridInfo {
  rowCount: number;
  rowSizes: number[];
  columnCount: number;
  columnSizes: number[];
}

export interface GridProps {
  smm: SMM;
  entries: FlatpakEntry[];
  onSelect?: (value: string) => Promise<void>;
}

export interface GridState {
  index: number;
}

export class Grid extends Component<GridProps, GridState> {
  ref = createRef<HTMLDivElement>();

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }

    // Handle button input
    const options = {
      capture: true,
      passive: true,
      once: false,
    };
    this.ref.current.addEventListener(
      'cs-gp-button-down',
      async (event: any) => {
        console.log(`Got button press: ${event.detail.buttonCode}`);
        const buttonsHandled = [
          BTN_CODE.RIGHT,
          BTN_CODE.LEFT,
          BTN_CODE.DOWN,
          BTN_CODE.UP,
          BTN_CODE.A,
        ];

        if (!this.ref.current) {
          console.log('Main component not yet mounted');
          return;
        }

        // Do nothing if we have no list of entries
        if (!this.props.entries) {
          console.log('No grid entries available. Doing nothing.');
          return;
        }

        // Ignore button presses we don't care about
        if (!buttonsHandled.includes(event.detail.buttonCode)) {
          console.log("This is not the button we're looking for");
          return;
        }

        // Get the current index and max length of entries in the grid
        let index = this.state.index !== undefined ? this.state.index : 0;
        const min = 0;
        const max = this.props.entries.length - 1;
        console.log('Current selected index:', index);

        // Invoke our handler if 'A' was pressed
        if (event.detail.buttonCode === BTN_CODE.A) {
          const value = this.props.entries[index].flatpakAppId;
          console.log(`Clicked grid item ${value}`);
          if (this.props.onSelect && value) {
            await this.props.onSelect(value);
          }
          return;
        }

        // Get the number of columns and rows
        const gridInfo = this.getGridData(this.ref.current);

        // Update the selected index based on what direction was pressed
        if (event.detail.buttonCode === BTN_CODE.RIGHT) {
          index = Math.min(max, index + 1);
        }
        if (event.detail.buttonCode === BTN_CODE.LEFT) {
          index = Math.max(min, index - 1);
        }
        if (event.detail.buttonCode === BTN_CODE.DOWN) {
          index = Math.min(max, index + gridInfo.columnCount);
        }
        if (event.detail.buttonCode === BTN_CODE.UP) {
          index = Math.max(min, index - gridInfo.columnCount);
        }

        console.log('Setting index to:', index);
        this.setState({ index: index });
      },
      options
    );
  }

  // Returns the number of columns and rows in the grid
  getGridData(grid: HTMLDivElement): GridInfo {
    // calc computed style
    const gridComputedStyle = window.getComputedStyle(grid);

    return {
      // get number of grid rows
      rowCount: gridComputedStyle
        .getPropertyValue('grid-template-rows')
        .split(' ').length,
      // get number of grid columns
      columnCount: gridComputedStyle
        .getPropertyValue('grid-template-columns')
        .split(' ').length,
      // get grid row sizes
      rowSizes: gridComputedStyle
        .getPropertyValue('grid-template-rows')
        .split(' ')
        .map(parseFloat),
      // get grid column sizes
      columnSizes: gridComputedStyle
        .getPropertyValue('grid-template-columns')
        .split(' ')
        .map(parseFloat),
    };
  }

  render(props: GridProps, state: GridState) {
    const entries = props.entries ? props.entries : [];
    const selected = state.index ? state.index : 0;
    const onSelect = props.onSelect ? props.onSelect : () => {};
    return (
      <div
        class="cssgrid_Container_DGRkX Panel Focusable gpfocuswithin"
        style="padding-left: 38px;"
      >
        <div
          ref={this.ref}
          data-cs-gp-init-focus="true"
          data-cs-gp-in-group="root"
          data-cs-gp-item="flathub-app-list"
          data-cs-gp-item-custom-events="true"
          class="cssgrid_CSSGrid_3vHkm allcollections_Grid_Ma65K Panel Focusable gpfocuswithin"
          style="grid-template-columns: repeat(auto-fill, 170px); grid-auto-rows: 185px; gap: 22px; font-size: 16.8182px; paddding-left: 0px; padding-right: 0px; outline: white solid 0px;"
        >
          {entries.map((entry, index) => (
            <GridItem
              smm={props.smm}
              img={entry.iconMobileUrl}
              text={entry.name}
              selected={selected === index}
              onClick={(event) => onSelect(props.entries[index].flatpakAppId)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export interface GridItemProps {
  smm: SMM;
  img: string;
  text: string;
  selected: boolean;
  onClick: (event: any) => void;
}

export interface GridItemState {
  imgData: string;
  imgUrl: string;
}

export class GridItem extends Component<GridItemProps, GridItemState> {
  ref = createRef<HTMLDivElement>();
  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }

    // Fetch and render the grid image
    const imgData = await cachedCurlBase64(this.props.smm, this.props.img);
    this.setState({
      imgData: `data:image/png;base64, ${imgData}`,
      imgUrl: this.props.img,
    });
  }

  // Update our state if we recieve new properties
  async componentWillReceiveProps(
    nextProps: GridItemProps,
    nextState: GridItemState
  ) {
    // Scroll to us if we got selected
    if (nextProps.selected && this.ref.current) {
      this.ref.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Don't re-fetch images unless our URL changes
    if (this.props.img === nextProps.img) {
      return;
    }
    const imgData = await cachedCurlBase64(nextProps.smm, nextProps.img);
    this.setState({
      imgData: `data:image/png;base64, ${imgData}`,
      imgUrl: nextProps.img,
    });
  }

  render(props: GridItemProps, state: GridItemState) {
    const style = props.selected ? 'border-style: ridge;' : '';
    return (
      <div
        ref={this.ref}
        class="allcollections_Collection_3IWn- Focusable gpfocuswithin"
        style={style}
        tabIndex={0}
        onClick={props.onClick}
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
