import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';

// Returns a copy of `url` with every WebView param (see WEBVIEW_PARAMS) removed.
// Pure — does not touch the address bar or page.url.
//
// The client never has these in its URL (captureWebviewSession strips them at
// boot), but the server request URL still carries them, so the server Sentry
// config uses this to keep the slurm token out of error and transaction
// reports.
export function stripWebviewParams(url: URL): URL {
  const sanitized = new URL(url);
  Object.values(WEBVIEW_PARAMS).forEach((param) =>
    sanitized.searchParams.delete(param)
  );
  return sanitized;
}
