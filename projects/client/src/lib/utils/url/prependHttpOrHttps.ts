import { prependHttps } from './prependHttps.ts';

type HttpUrl = `http://${string}`;

export function prependHttpOrHttps(
  url: string | Nil,
): HttpsUrl | HttpUrl | Nil {
  if (!url) {
    return null;
  }

  const isLocalhost = url.includes('localhost');

  if (isLocalhost) {
    return url.startsWith('http://') ? url as HttpUrl : `http://${url}`;
  }

  return prependHttps(url);
}
