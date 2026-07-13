import { page } from '$app/state';
import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import type { WebviewParam } from './WebviewParam.ts';
import { webviewStorageKey } from './webviewStorageKey.ts';

// Reads a WebView param. On the client it was latched to sessionStorage at boot
// (captureWebviewSession) and the URL is already clean, so storage wins; on the
// server (no storage) it falls back to the URL param still present during SSR.
// Both paths yield the same value, so the first client render matches SSR. An
// empty param normalises to undefined so `?slurm=` never counts as a value.
export function readWebviewParam(param: WebviewParam): string | undefined {
  const value = safeSessionStorage.getItem(webviewStorageKey(param)) ??
    page.url.searchParams.get(WEBVIEW_PARAMS[param]);
  return value ? value : undefined;
}
