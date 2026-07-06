import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';

// The native apps append `standalone_mode` (see WEBVIEW_PARAMS) when they open a
// YIR/MIR inside a WebView; when set, the app chrome is stripped so the page
// reads as a native screen. The flag is captured at client boot
// (captureWebviewSession) and latched here so it survives in-page navigation and
// a param-less reload. WebView-local.
const STORAGE_KEY = 'trakt-standalone-mode';

export function isStandaloneValue(value: string | null | undefined): boolean {
  return value === '1' || value === 'true';
}

export function getStandalone(): boolean {
  return safeSessionStorage.getItem(STORAGE_KEY) === '1';
}

export function setStandalone(): void {
  safeSessionStorage.setItem(STORAGE_KEY, '1');
}
