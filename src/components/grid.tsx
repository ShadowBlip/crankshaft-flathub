import { Component, createRef, RefObject } from 'preact';
import { SMM } from '../types/SMM';
import { curlBase64 } from '../util/curl';

export interface GridItemProps {
  smm: SMM;
  img: string;
  text: string;
}

export interface GridItemState {
  imgData: string;
  imgUrl: string;
}

export class GridItem extends Component<GridItemProps, GridItemState> {
  ref = createRef();
  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
    const imgData = await curlBase64(this.props.smm, this.props.img);
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
    const imgData = await curlBase64(nextProps.smm, nextProps.img);
    this.setState({
      imgData: `data:image/png;base64, ${imgData}`,
      imgUrl: nextProps.img,
    });
  }

  render(props: GridItemProps, state: GridItemState) {
    return (
      <div
        ref={this.ref}
        class="allcollections_Collection_3IWn- Focusable gpfocuswithin"
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
