import { browser } from '$app/environment';
import { page } from '$app/state';
import {
  getStandalone,
  isStandaloneValue,
} from '$lib/features/standalone/standaloneFlag.ts';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import { resolveSlurm } from './resolveSlurm.ts';

// Exposes the WebView session params for a page. Capture + URL strip already
// happened at client boot (captureWebviewSession, from hooks.client), so on the
// client these read from sessionStorage while the URL is clean; on the server
// (no storage) they read the URL params that are still present during SSR. Both
// yield the same values, so the first client render matches SSR.
export function useWebviewSession() {
  const slurm = resolveSlurm();

  const isStandalone = browser ? getStandalone() : isStandaloneValue(
    page.url.searchParams.get(WEBVIEW_PARAMS.standaloneMode),
  );

  return { slurm, isStandalone };
}
