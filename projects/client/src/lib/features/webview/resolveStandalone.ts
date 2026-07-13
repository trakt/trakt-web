import { readWebviewParam } from './readWebviewParam.ts';

// True when the native app opened the review in standalone WebView mode
// (`standalone_mode`), so the page drops app chrome and reads as a native
// screen. Accepts the app's `1` and `true` spellings.
export function resolveStandalone(): boolean {
  const value = readWebviewParam('standaloneMode');
  return value === '1' || value === 'true';
}
