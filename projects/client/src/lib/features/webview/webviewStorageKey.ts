import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import type { WebviewParam } from './WebviewParam.ts';

// The sessionStorage key a captured WebView param is latched under, so it
// survives in-page navigation and a param-less reload while staying WebView- and
// tab-local. Shared by the writer (captureWebviewSession) and the reader
// (readWebviewParam) so they can never drift.
export function webviewStorageKey(param: WebviewParam): string {
  return `trakt-webview-${WEBVIEW_PARAMS[param]}`;
}
