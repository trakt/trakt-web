const WALTER = 'walter-r2.trakt.tv';

export function prependStorageHost(
  url: string | Nil,
  extension: `.${string}` | '',
): HttpsUrl | '' {
  if (!url) {
    return '';
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  const imageUrl = url.startsWith(WALTER) ? url as HttpsUrl : `${WALTER}${path}`;

  return `${imageUrl}${extension}` as HttpsUrl;
}
