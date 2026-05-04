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
  const trimmed = url?.trim();
  if (!trimmed) return placeholder;

  if (trimmed.startsWith('https://')) {
    return trimmed as HttpsUrl;
  }

  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://') as HttpsUrl;
  }

  return `https://${trimmed}` as HttpsUrl;
}
