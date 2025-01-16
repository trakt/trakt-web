// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference lib="dom" />

import { Environment } from '$lib/api.ts';

declare global {
  /**
   * Global This
   */
  var install: BeforeInstallPromptEvent | Nil;

  /**
   * VITE environment variables
   */
  const TRAKT_CLIENT_ID: string;
  const TRAKT_MODE: 'development' | 'production' | 'test';
  const TRAKT_TARGET_ENVIRONMENT: Environment;

  const FIREBASE_PROJECT_ID: string;
  const FIREBASE_API_KEY: string;
  const FIREBASE_APP_ID: string;
  const FIREBASE_MEASUREMENT_ID: string;
  const FIREBASE_MESSAGING_SENDER_ID: string;

  /**
   * Types
   */
  type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  };

  type Nil = null | undefined;

  type HttpsUrl = `https://${string}`;

  type ChildrenProps = {
    children: import('svelte').Snippet;
  };

  type IconProps = {
    size?: 'normal' | 'small';
  };

  type HTMLImageElementProps = {
    src: string;
    alt: string;
    onload?: (event: Event) => void;
    onerror?: (event: Event) => void;
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

    /** Pointer */
    onpointerdown?: (event: PointerEvent) => void;
    onpointerdowncapture?: (event: PointerEvent) => void;
    onpointermove?: (event: PointerEvent) => void;
    onpointermovecapture?: (event: PointerEvent) => void;
    onpointerup?: (event: PointerEvent) => void;
    onpointerupcapture?: (event: PointerEvent) => void;
    onpointercancel?: (event: PointerEvent) => void;
    onpointercancelcapture?: (event: PointerEvent) => void;
    onpointerover?: (event: PointerEvent) => void;
    onpointerovercapture?: (event: PointerEvent) => void;
    onpointerout?: (event: PointerEvent) => void;
    onpointeroutcapture?: (event: PointerEvent) => void;
    onpointerenter?: (event: PointerEvent) => void;
    onpointerentercapture?: (event: PointerEvent) => void;
    onpointerleave?: (event: PointerEvent) => void;
    onpointerleavecapture?: (event: PointerEvent) => void;
    ongotpointercapture?: (event: PointerEvent) => void;
    ongotpointercapturecapture?: (event: PointerEvent) => void;
    onlostpointercapture?: (event: PointerEvent) => void;
    onlostpointercapturecapture?: (event: PointerEvent) => void;

    /** Touch */
    ontouchcancel?: (event: TouchEvent) => void;
    ontouchcancelcapture?: (event: TouchEvent) => void;
    ontouchend?: (event: TouchEvent) => void;
    ontouchendcapture?: (event: TouchEvent) => void;
    ontouchmove?: (event: TouchEvent) => void;
    ontouchmovecapture?: (event: TouchEvent) => void;
    ontouchstart?: (event: TouchEvent) => void;
    ontouchstartcapture?: (event: TouchEvent) => void;
  };

  type HTMLAnchorProps = {
    href: string | Nil;
    target?: '_blank' | '_self' | '_parent' | '_top';
    noscroll?: boolean;
  };

  type AudienceProps = {
    audience: 'authenticated' | 'public' | 'all';
  };

  export type ButtonProps =
    & {
      label: string;
      title?: string;
    }
    & HTMLElementProps
    & ChildrenProps;

  namespace App {
    // interface Error {}
    interface Locals {
      theme: import('$lib/features/theme/models/Theme').Theme;
      auth:
        | import('$lib/features/auth/models/SerializedAuthResponse').SerializedAuthResponse
        | Nil;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace svelteHTML {
    interface HTMLAttributes {
      /**
       * Works only in conjunction with the `clickOutside` action.
       */
      'onclickoutside'?: (ev: CustomEvent) => void;
    }
  }
}

export {};
