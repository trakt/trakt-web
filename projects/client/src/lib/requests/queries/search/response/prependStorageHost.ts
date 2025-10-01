const WALTER = 'walter-r2.trakt.tv';

export function prependStorageHost(
  url: string | Nil,
  extension: `.${string}` | '',
): HttpsUrl | '' {
  if (!url) {
    return '';
  }

  const imageUrl = url.startsWith(WALTER) ? url as HttpsUrl : `${WALTER}${url}`;

  return `${imageUrl}${extension}` as HttpsUrl;
}
