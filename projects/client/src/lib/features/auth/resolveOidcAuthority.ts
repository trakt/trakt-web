import { isWorkerAuthHost } from '$lib/utils/url/isWorkerAuthHost.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { deriveStandardAuthority } from './deriveStandardAuthority.ts';

export function resolveOidcAuthority(): HttpsUrl {
  if (isWorkerAuthHost(globalThis.window?.location.hostname)) {
    return prependHttps('auth.trakt.tv');
  }

  return deriveStandardAuthority();
}
