import { NOOP_FN } from '$lib/utils/constants.ts';
import { isMobileAppleDevice } from '$lib/utils/devices/isMobileAppleDevice.ts';

function setGlobalDialogHeight(height: string) {
  document.documentElement.style.setProperty(
    '--dialog-height',
    height,
  );
}

function forceDialogOnScreen(dialog: HTMLDialogElement) {
  if (!dialog.open) {
    return;
  }

  requestAnimationFrame(() => {
    globalThis.window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  });
}

/*
  interactive-widget=resizes-content does not work on mobile Safari.
  So, we need to manually update the dialog height when the visual viewport changes.

  https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

  FIXME:
  -see if we can do this without scrolling to the top
  -completely block page scrolling when dialog is open
*/
export function mobileAppleVisualViewportHack(dialog: HTMLDialogElement) {
  if (!isMobileAppleDevice() || !globalThis.window.visualViewport) {
    return {
      destroy: NOOP_FN,
    };
  }

  const applyViewportHacks = () => {
    requestAnimationFrame(() => {
      setGlobalDialogHeight(`${globalThis.window.visualViewport?.height}px`);
      forceDialogOnScreen(dialog);
    });
  };

  globalThis.window.visualViewport.addEventListener(
    'resize',
    applyViewportHacks,
  );

  return {
    destroy() {
      setGlobalDialogHeight('100dvh');
      globalThis.window.visualViewport?.removeEventListener(
        'resize',
        applyViewportHacks,
      );
    },
  };
}
