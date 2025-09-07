import { browser } from '$app/environment';

type AppleMobileDevice = 'iphone' | 'ipad' | 'none';

/*
  While navigator.platform is deprecated, it is the least bad
  option to use to reliably detect iPhones & iPads
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
*/
export function getMobileAppleDeviceType(): AppleMobileDevice {
  if (!browser) {
    return 'none';
  }

  // Respected by browsers (Safari, Chrome, Edge, Firefox)
  const isIphone = navigator.platform === 'iPhone';
  if (isIphone) {
    return 'iphone';
  }

  // By default since iOS 13, the platform is returned as 'MacIntel'
  const isDesktopClassIpad = navigator.platform === 'MacIntel' &&
    navigator.maxTouchPoints > 1;

  // Respected only by Chromium broswers (Chrome, Edge)
  const isIpad = navigator.platform === 'iPad';
  if (isDesktopClassIpad || isIpad) {
    return 'ipad';
  }

  return 'none';
}
