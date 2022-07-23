import { Component, ComponentChildren } from 'preact';

const TOGGLED_OFF = 'gamepaddialog_Toggle_24G4g Focusable';
const TOGGLED_ON = `${TOGGLED_OFF} gamepaddialog_On_3ld7T`;

export interface ToggleProps {
  children?: ComponentChildren;
  description?: string;
  enabled?: boolean;
  name?: string;
  onClick?: (e: Event, toggleState: boolean) => Promise<void>;
}

export interface ToggleState {
  toggled: boolean;
  buttonClasses: string;
}

export class Toggle extends Component<ToggleProps, ToggleState> {
  constructor(props: ToggleProps) {
    super(props);
    this.state = {
      toggled: false,
      buttonClasses: TOGGLED_OFF,
    };
  }

  private toggle() {
    const toggled = !this.state.toggled;
    this.setState({
      toggled: toggled,
      buttonClasses: toggled ? TOGGLED_ON : TOGGLED_OFF,
    });
  }

  private async onClick(e: Event) {
    this.toggle();
    if (!this.props.onClick) {
      return;
    }
    await this.props.onClick(e, this.state.toggled);
  }

  render(props: ToggleProps) {
    return (
      <div>
        <div class="gamepaddialog_FieldLabelRow_H9WOq">
          <div class="gamepaddialog_FieldLabel_3b0U-">{props.name}</div>
          <div
            class={this.state.buttonClasses}
            onClick={(e: Event) => this.onClick(e)}
          >
            <div class="gamepaddialog_ToggleRail_2JtC3"></div>
            <div class="gamepaddialog_ToggleSwitch_3__OD"></div>
          </div>
        </div>
        <div class="gamepaddialog_FieldDescription_2OJfk">
          {props.description}
        </div>
      </div>
    );
  }
}
