import { Component, createRef } from 'preact';
import { SMM } from '../types/SMM';

export interface SearchProps {
  smm: SMM;
  onInputChange?: (value: string) => Promise<void>;
}

export interface SearchState {
  value: string;
  focused: boolean;
}

export class SearchBar extends Component<SearchProps, SearchState> {
  ref = createRef<HTMLDivElement>();
  searchHeader = createRef<HTMLDivElement>();
  searchContainer = createRef<HTMLDivElement>();
  searchBackground = createRef<HTMLDivElement>();
  searchInput = createRef<HTMLInputElement>();

  constructor(props: SearchProps) {
    super(props);
  }

  async componentDidMount() {
    if (!this.ref.current) {
      return;
    }
  }

  // Gets called when the search bar gets clicked
  async onClick(e: Event) {
    console.log(`Clicked search bar: ${e}`);
    await this.focus();
  }

  // Will update the classes to change the look of the search bar.
  async focus() {
    if (!this.state.focused) {
      // If we're not focused, focus us!
      this.searchHeader.current?.classList.add('gpfocuswithin');
      this.searchContainer.current?.classList.add('gpfocuswithin');
      this.searchBackground.current?.classList.add(
        'searchbar_WhiteBackground_1l8js'
      );
      this.searchInput.current?.classList.add(
        'searchbar_WhiteBackground_1l8js',
        'gpfocus',
        'gpfocuswithin'
      );
      this.searchInput.current?.focus();
    } else {
      // If we are focused, UN-focus us!
      this.searchHeader.current?.classList.remove('gpfocuswithin');
      this.searchContainer.current?.classList.remove('gpfocuswithin');
      this.searchBackground.current?.classList.remove(
        'searchbar_WhiteBackground_1l8js'
      );
      this.searchInput.current?.classList.remove(
        'searchbar_WhiteBackground_1l8js',
        'gpfocus',
        'gpfocuswithin'
      );
    }
    this.setState({ focused: !this.state.focused, value: this.state.value });
  }

  // onInput gets called every time a letter is typed into the search bar.
  async onInput(e: Event) {
    const value = this.searchInput.current?.value;
    this.setState({ focused: this.state.focused, value: value });
    if (this.props.onInputChange && value) {
      await this.props.onInputChange(value);
    }
  }

  render(props: SearchProps) {
    return (
      <div ref={this.ref}>
        <div
          ref={this.searchHeader}
          class="header_Header_1E_SL FlexGrowUniversalSearch Panel Focusable"
        >
          <div
            ref={this.searchContainer}
            class="searchbar_SearchContainer_161Tj searchbar_ForceExpanded_1bmuJ Panel Focusable"
            data-cs-gp-in-group="root"
            data-cs-gp-item="flathub-search-bar"
            data-cs-gp-init-focus="true"
            onClick={(e) => this.onClick(e)}
          >
            <div
              ref={this.searchBackground}
              class="searchbar_SearchFieldBackground_3F4YR"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              fill="none"
              class="searchbar_SearchIconLeft_2Ya83"
              width="24px"
              height="24px"
            >
              <path
                d="M27.5 24C29.4972 21.1283 30.3471 17.6129 29.8823 14.146C29.4174 10.679 27.6716 7.5117 24.9884 5.26751C22.3052 3.02332 18.8792 1.86488 15.3846 2.02023C11.8901 2.17559 8.58036 3.63349 6.10692 6.10692C3.63349 8.58036 2.17559 11.8901 2.02023 15.3846C1.86488 18.8792 3.02332 22.3052 5.26751 24.9884C7.5117 27.6716 10.679 29.4174 14.146 29.8823C17.6129 30.3471 21.1283 29.4972 24 27.5L30.26 33.77L30.62 33.41L33.44 30.59L33.8 30.23L27.5 24ZM16 25C14.22 25 12.4799 24.4722 10.9999 23.4832C9.51983 22.4943 8.36628 21.0887 7.68509 19.4442C7.0039 17.7996 6.82567 15.99 7.17294 14.2442C7.52021 12.4984 8.37737 10.8947 9.63605 9.63605C10.8947 8.37737 12.4984 7.52021 14.2442 7.17294C15.99 6.82567 17.7996 7.0039 19.4442 7.68509C21.0887 8.36628 22.4943 9.51983 23.4832 10.9999C24.4722 12.4799 25 14.22 25 16C25 18.387 24.0518 20.6761 22.364 22.364C20.6761 24.0518 18.387 25 16 25Z"
                fill="currentColor"
              ></path>
            </svg>
            <input
              ref={this.searchInput}
              onClick={(e) => this.onClick(e)}
              onInput={(e) => this.onInput(e)}
              data-cs-gp-in-group="flathub-search-bar"
              data-cs-gp-item="flathub-search-bar-input"
              placeholder="Search for flatpaks..."
              class="searchbar_SearchBox_2a1-s searchbar_Visible_1bLfc Focusable"
              tabIndex={0}
              value={this.state.value}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              fill="none"
              class="searchbar_SearchIconRight_1Ka4T"
              width="24px"
              height="24px"
            >
              <path
                d="M27.5 24C29.4972 21.1283 30.3471 17.6129 29.8823 14.146C29.4174 10.679 27.6716 7.5117 24.9884 5.26751C22.3052 3.02332 18.8792 1.86488 15.3846 2.02023C11.8901 2.17559 8.58036 3.63349 6.10692 6.10692C3.63349 8.58036 2.17559 11.8901 2.02023 15.3846C1.86488 18.8792 3.02332 22.3052 5.26751 24.9884C7.5117 27.6716 10.679 29.4174 14.146 29.8823C17.6129 30.3471 21.1283 29.4972 24 27.5L30.26 33.77L30.62 33.41L33.44 30.59L33.8 30.23L27.5 24ZM16 25C14.22 25 12.4799 24.4722 10.9999 23.4832C9.51983 22.4943 8.36628 21.0887 7.68509 19.4442C7.0039 17.7996 6.82567 15.99 7.17294 14.2442C7.52021 12.4984 8.37737 10.8947 9.63605 9.63605C10.8947 8.37737 12.4984 7.52021 14.2442 7.17294C15.99 6.82567 17.7996 7.0039 19.4442 7.68509C21.0887 8.36628 22.4943 9.51983 23.4832 10.9999C24.4722 12.4799 25 14.22 25 16C25 18.387 24.0518 20.6761 22.364 22.364C20.6761 24.0518 18.387 25 16 25Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
