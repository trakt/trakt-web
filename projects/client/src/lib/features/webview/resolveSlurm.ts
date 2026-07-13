import { page } from '$app/state';
import { WEBVIEW_PARAMS } from '$lib/utils/url/webviewParams.ts';
import { getSlurm } from './slurmToken.ts';

// Resolves the WebView VIP token for a YIR/MIR data request. The single source
// of truth for reading it. On the client the token was latched to
// sessionStorage at boot (captureWebviewSession) and the URL is already clean,
// so getSlurm() wins; on the server (no storage) it falls back to the URL param
// that is still present during SSR. An empty param normalises to undefined so
// `?slurm=` never counts as a token.
export function resolveSlurm(): string | undefined {
  const token = getSlurm() ?? page.url.searchParams.get(WEBVIEW_PARAMS.slurm);
  return token ? token : undefined;
}
