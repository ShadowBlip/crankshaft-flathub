// Open the virtual keyboard
/*
        "e" is an element the keyboard is acting on. "t" is that element's
   properties ShowVirtualKeyboard(e, t) { this.m_ActiveElementProps = t,
   this.SetVirtualKeyboardActiveRef(e), this.SetVirtualKeyboardShown(!0),
   l.a.PlayNavSound(l.b.OpenSideMenu), setTimeout((() => { var e; return null
   === (e = document.activeElement) || void 0 === e ? void 0 :
   e.scrollIntoView({ behavior: "smooth", block: "nearest"
                })
            }), 0)
        }
       */

/*
export interface VirtualKeyboardRef {
  BIsActive: () => boolean;
  BIsElementValidForInput: () => boolean;
  DelayHideVirtualKeyboard: (delay: number) => void;
}
*/

// SpecialKeys are keys that can be pressed.
export const SpecialKeys = [
  'Backspace',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
  'Tab',
];

// SteamClient.Input.ControllerKeyboardSendText("")
// return "Backspace" == e ? (SteamClient.Input.ControllerKeyboardSendText(""), !0) : "Enter" == e ? (SteamClient.Input.ControllerKeyboardSendText(""), !0) : "Tab" == e ? (SteamClient.Input.ControllerKeyboardSendText("\t"), !0) : (1 === e.length || "ArrowLeft" != e && "ArrowRight" != e && "Tab" != e) && (SteamClient.Input.ControllerKeyboardSendText(e), !0)

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

export const OpenVirtualKeyboard = (props: VirtualKeyboardProps) => {
  if (!props.onTextEntered) {
    props.onTextEntered = (e, t) => {
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
  //@ts-ignore
  const ref =
    window.coolClass.VirtualKeyboardManager.CreateVirtualKeyboardRef(props);
  //@ts-ignore
  window.coolClass.VirtualKeyboardManager.ShowVirtualKeyboard(ref, props);
};
