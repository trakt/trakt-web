import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import type { WebviewParam } from './WebviewParam.ts';
import { webviewStorageKey } from './webviewStorageKey.ts';

const WEBVIEW_PARAM_KEYS = Object.keys(WEBVIEW_PARAMS) as WebviewParam[];

// Runs once at client boot (from hooks.client), before Sentry.init and before
// SvelteKit reads `location` to build `page.url`. It latches every WebView param
// into sessionStorage and strips them from the URL with a raw History replace.
//
// Doing it this early is the whole point: SvelteKit then builds `page.url` from
// the already-clean `location`, so no downstream sink ever sees the slurm token
// (Sentry tracing/replay, analytics page_view, shared links). A raw
// replaceState is fine here precisely because it runs before `page.url` exists;
// the same call from a component's onMount would not update `page.url`.
export function captureWebviewSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);

  const present = WEBVIEW_PARAM_KEYS.filter((param) =>
    url.searchParams.has(WEBVIEW_PARAMS[param])
  );
  if (present.length === 0) {
    return;
  }

  present.forEach((param) => {
    const name = WEBVIEW_PARAMS[param];
    const value = url.searchParams.get(name);
    if (value) {
      safeSessionStorage.setItem(webviewStorageKey(param), value);
    }
    url.searchParams.delete(name);
  });

  window.history.replaceState(window.history.state, '', url);
}
