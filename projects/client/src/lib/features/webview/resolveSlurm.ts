import { page } from '$app/state';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import { getSlurm } from './slurmToken.ts';

// Resolves the WebView VIP token for a YIR/MIR data request. On the client the
// token was latched to sessionStorage at boot (captureWebviewSession) and the
// URL is already clean, so getSlurm() wins; on the server (no storage) it falls
// back to the URL param that is still present during SSR.
export function resolveSlurm(): string | undefined {
  return getSlurm() ?? page.url.searchParams.get(WEBVIEW_PARAMS.slurm) ??
    undefined;
}
