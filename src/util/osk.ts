// SpecialKeys are keys that can be pressed.
export const SpecialKeys = [
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
  'Tab',
  'VKClose',
];

export interface VirtualKeyboardProps {
  BIsElementValidForInput?: () => boolean;
  onEnterKeyPress?: () => string;
  onKeyboardFullyVisible?: () => void;
  onKeyboardNavOut?: () => void;
  onKeyboardShow?: () => void;
  // The 'key' can be a letter, or names of keys like 'Backspace', 'ArrowLeft', 'Enter'
  onTextEntered?: (key: string, shiftHeld: boolean) => void;
  // Text to replace the Enter key on the keyboard
  strEnterKeyLabel?: string;
}

// Open the virtual keyboard
export const OpenVirtualKeyboard = async (props: VirtualKeyboardProps) => {
  if (!props.onTextEntered) {
    props.onTextEntered = (e, t) => {
      console.log(`Key pressed: ${e}`);
      return 'Backspace' == e
        ? (window.SteamClient.Input.ControllerKeyboardSendText(''), !0)
        : 'Enter' == e
        ? (window.SteamClient.Input.ControllerKeyboardSendText(''), !0)
        : 'Tab' == e
        ? (window.SteamClient.Input.ControllerKeyboardSendText('\t'), !0)
        : (1 === e.length ||
            ('ArrowLeft' != e && 'ArrowRight' != e && 'Tab' != e)) &&
          (window.SteamClient.Input.ControllerKeyboardSendText(e), !0);
    };
  }

  // Update the Crankshaft handler so it won't intercept for the keyboard
  // NOTE: This should be handled in a future Crankshaft version
  const handler = window.csButtonInterceptors![0].handler;
  window.csButtonInterceptors![0].handler = (
    buttonCode: number
  ): boolean | void => {
    if (
      window.coolClass.VirtualKeyboardManager.IsShowingVirtualKeyboard
        .m_currentValue
    ) {
      return false;
    }
    return handler(buttonCode);
  };

  // coolClass.VirtualKeyboardManager.SetVirtualKeyboardShown(0)
  //@ts-ignore
  //window.coolClass.VirtualKeyboardManager.SetVirtualKeyboardShown(1);

  // Use the native client to open the virtual keyboard
  //@ts-ignore
  const ref =
    window.coolClass.VirtualKeyboardManager.CreateVirtualKeyboardRef(props);
  //@ts-ignore
  window.coolClass.VirtualKeyboardManager.ShowVirtualKeyboard(ref, props);
};
