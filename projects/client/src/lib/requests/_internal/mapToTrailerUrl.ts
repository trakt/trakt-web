import { prependHttps } from '$lib/utils/url/prependHttps.ts';

export function mapToTrailerUrl(url: string | Nil): HttpsUrl | undefined {
  const httpsUrl = prependHttps(url);
  if (!httpsUrl) return undefined;

  try {
    const parsed = new URL(httpsUrl);
    return parsed.searchParams.has('v') ? httpsUrl : undefined;
  } catch {
    return undefined;
  }
}
