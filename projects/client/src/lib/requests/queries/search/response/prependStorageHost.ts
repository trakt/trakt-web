const STORAGE_HOST = 'media.trakt.tv';

export function prependStorageHost(
  url: string | Nil,
  extension: `.${string}` | '',
): HttpsUrl | '' {
  if (!url) {
    return '';
  }

  const hasHost = url.startsWith('http') || url.includes('.trakt.tv');
  const path = url.startsWith('/') ? url : `/${url}`;
  const imageUrl = hasHost ? url : `${STORAGE_HOST}${path}`;

  return imageUrl.endsWith(extension)
    ? imageUrl as HttpsUrl
    : `${imageUrl}${extension}` as HttpsUrl;
}
