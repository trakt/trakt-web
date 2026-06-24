import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function deriveStandardAuthority(): HttpsUrl {
  return prependHttps(
    TRAKT_TARGET_ENVIRONMENT
      .replace('api.', '')
      .replace('apiz.', '')
      .replace('hd.', '')
      .replace('api-staging.', 'staging.'),
  );
}
