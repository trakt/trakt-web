import { isWorkerAuthHost } from '../url/isWorkerAuthHost.ts';
import { IS_DEV, IS_PREVIEW } from '../env/index.ts';

export function getReferrer() {
  if (IS_DEV) {
    return 'http://localhost:5173';
  }

  if (IS_PREVIEW) {
    return 'http://localhost:4173';
  }

  // workers.dev hosts (worker-auth beta) serve from their own origin; return it
  // so OAuth redirects come back to the same host, not the prod app origin.
  if (isWorkerAuthHost(globalThis.window?.location.hostname)) {
    return globalThis.window.location.origin;
  }

  return 'https://app.trakt.tv';
}
