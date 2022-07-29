import { Component, createRef, RefObject } from 'preact';

export interface InstallButtonProps {
  text?: string;
  onSelect?: (value: string) => Promise<void>;
}

export interface InstallButtonState {
  selected: boolean;
}

export class InstallButton extends Component<
  InstallButtonProps,
  InstallButtonState
> {
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
  }

  async onClick(e: Event) {
    const value = this.props.text;
    if (this.props.onSelect && value) {
      await this.props.onSelect(value);
    }
  }
  render(props: InstallButtonProps, state: InstallButtonState) {
    const defaultStyle = 'display: flex; justify-content: flex-end;';
    const style = state.selected
      ? defaultStyle + 'border-style: ridge'
      : defaultStyle;
    return (
      <div style="margin-left: auto; margin-right: 0;">
        {/* The install button has data-cs-gp for gamepad focus */}
        <div
          ref={this.ref}
          class="appactionbutton_PlayButton_3ydig appactionbutton_ButtonChild_2AzIX Focusable gpfocus gpfocuswithin"
          style={style}
          data-cs-gp-in-group="flathub-app-info"
          data-cs-gp-item="flathub-app-info-install"
          onClick={(e: Event) => {
            this.onClick(e);
          }}
          tabIndex={0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            fill="none"
          >
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
          <div class="appactionbutton_ButtonText_33cnX">{props.text}</div>
        </div>
      </div>
    );
  }
}
