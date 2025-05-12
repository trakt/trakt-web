import { browser } from '$app/environment';

export function isPWA() {
  if (!browser) {
    return false;
  }

  return (
    sessionStorage.getItem('__trakt_pwa_simulator') === 'true' ||
    globalThis.matchMedia('(display-mode: standalone)').matches ||
    globalThis.matchMedia('(display-mode: fullscreen)').matches ||
    globalThis.matchMedia('(display-mode: minimal-ui)').matches
  );
}
