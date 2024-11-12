export function prependHttps(
  url: string | undefined,
  placeholder?: HttpsUrl,
): HttpsUrl | Nil {
  if (!url) {
    return placeholder;
  }

  return url.startsWith('https://') ? url as HttpsUrl : `https://${url}`;
}
