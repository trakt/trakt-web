import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function resolveOidcAuthority(): HttpsUrl {
  return prependHttps('auth.trakt.tv');
}
