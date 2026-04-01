export function appendWebp(url: HttpsUrl): HttpsUrl;
export function appendWebp(url: HttpsUrl | Nil): HttpsUrl | Nil;
export function appendWebp(url: HttpsUrl | Nil): HttpsUrl | Nil {
  if (!url || url.endsWith('.webp')) return url;
  return `${url}.webp` as HttpsUrl;
}
