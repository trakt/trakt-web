import { prependHttps } from '$lib/utils/url/prependHttps.ts';

const STORAGE_HOST = 'media.trakt.tv';

export function prependStorageHost(
  url: string | Nil,
  extension: `.${string}` | '',
): HttpsUrl | '' {
  if (!url) {
    return '';
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  return prependHttps(`${STORAGE_HOST}${path}${extension}`);
}
