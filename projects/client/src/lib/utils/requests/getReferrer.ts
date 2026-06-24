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
  const host = globalThis.window?.location.hostname;
  if (host?.endsWith('.workers.dev')) {
    return globalThis.window.location.origin;
  }

  return 'https://app.trakt.tv';
}
