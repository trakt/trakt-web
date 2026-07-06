import {
  isStandaloneValue,
  setStandalone,
} from '$lib/features/standalone/standaloneFlag.ts';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import { setSlurm } from './slurmToken.ts';

// Runs once at client boot (from hooks.client), before Sentry.init and before
// SvelteKit reads `location` to build `page.url`. It latches the WebView params
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

  const slurm = url.searchParams.get(WEBVIEW_PARAMS.slurm);
  if (slurm) {
    setSlurm(slurm);
  }

  if (isStandaloneValue(url.searchParams.get(WEBVIEW_PARAMS.standaloneMode))) {
    setStandalone();
  }

  const present = Object.values(WEBVIEW_PARAMS).filter((param) =>
    url.searchParams.has(param)
  );
  if (present.length === 0) {
    return;
  }

  present.forEach((param) => url.searchParams.delete(param));
  window.history.replaceState(window.history.state, '', url);
}
