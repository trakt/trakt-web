// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference lib="dom" />

declare global {
  const TRAKT_CLIENT_ID: string;
  const TRAKT_MODE: 'development' | 'production';

  type Nil = null | undefined;

  type HttpsUrl = `https://${string}`;

  type ChildrenProps = {
    children: import('svelte').Snippet;
  };

  type HTMLElementProps = {
    disabled?: boolean;

    /** Keyboard */
    onkeydown?: (event: KeyboardEvent) => void;
    onkeydowncapture?: (event: KeyboardEvent) => void;
    onkeypress?: (event: KeyboardEvent) => void;
    onkeypresscapture?: (event: KeyboardEvent) => void;
    onkeyup?: (event: KeyboardEvent) => void;
    onkeyupcapture?: (event: KeyboardEvent) => void;

    /** Focus */
    onblur?: (event: FocusEvent) => void;
    onblurcapture?: (event: FocusEvent) => void;
    onfocus?: (event: FocusEvent) => void;
    onfocuscapture?: (event: FocusEvent) => void;
    onfocusin?: (event: FocusEvent) => void;
    onfocusincapture?: (event: FocusEvent) => void;
    onfocusout?: (event: FocusEvent) => void;
    onfocusoutcapture?: (event: FocusEvent) => void;

    /** Mouse */
    onclick?: (event: MouseEvent) => void;
    onclickcapture?: (event: MouseEvent) => void;
    oncontextmenu?: (event: MouseEvent) => void;
    oncontextmenucapture?: (event: MouseEvent) => void;
    ondblclick?: (event: MouseEvent) => void;
    ondblclickcapture?: (event: MouseEvent) => void;
    onmousedown?: (event: MouseEvent) => void;
    onmousedowncapture?: (event: MouseEvent) => void;
    onmouseenter?: (event: MouseEvent) => void;
    onmouseentercapture?: (event: MouseEvent) => void;
    onmouseleave?: (event: MouseEvent) => void;
    onmouseleavecapture?: (event: MouseEvent) => void;
    onmousemove?: (event: MouseEvent) => void;
    onmousemovecapture?: (event: MouseEvent) => void;
    onmouseout?: (event: MouseEvent) => void;
    onmouseoutcapture?: (event: MouseEvent) => void;
    onmouseover?: (event: MouseEvent) => void;
    onmouseovercapture?: (event: MouseEvent) => void;
    onmouseup?: (event: MouseEvent) => void;
    onmouseupcapture?: (event: MouseEvent) => void;
  };

  export type ButtonProps =
    & {
      label: string;
    }
    & HTMLElementProps
    & ChildrenProps;

  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
