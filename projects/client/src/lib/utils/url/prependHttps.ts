export function prependHttps(url: string): HttpsUrl;
export function prependHttps(
  url: string | Nil,
  placeholder: HttpsUrl,
): HttpsUrl;
export function prependHttps(
  url: string | Nil,
  placeholder?: HttpsUrl,
): HttpsUrl | Nil;

export function prependHttps(
  url: string | Nil,
  placeholder?: HttpsUrl,
): HttpsUrl | Nil {
  if (!url) {
    return placeholder;
  }

  return url.startsWith('https://') ? url as HttpsUrl : `https://${url}`;
}
