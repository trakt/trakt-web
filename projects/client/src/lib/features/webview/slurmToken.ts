import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';

// The native apps open a Year/Month in Review in a WebView with a `slurm` URL
// param (see WEBVIEW_PARAMS) carrying the viewer's VIP token. It authorizes only
// the YIR/MIR data requests (mirroring trakt.tv v2, where the backend resolves
// the token to the viewing user); it is not an app-wide login session. Latched
// in sessionStorage so it survives in-page navigation and a param-less reload,
// and stays WebView-local.
const STORAGE_KEY = 'trakt-slurm';

export function getSlurm(): string | null {
  return safeSessionStorage.getItem(STORAGE_KEY);
}

export function setSlurm(token: string): void {
  safeSessionStorage.setItem(STORAGE_KEY, token);
}
