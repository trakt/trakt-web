import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';

const TRAKT_HOST = 'trakt.tv';
const WEB_PROTOCOLS = new Set(['http:', 'https:']);

const toResolvedUrl = (url: string) => {
  try {
    return new URL(url, SEO_ORIGIN);
  } catch {
    return null;
  }
};

export function isTraktUrl(url: string): boolean {
  const resolved = toResolvedUrl(url);
  if (!resolved) return false;
  if (!WEB_PROTOCOLS.has(resolved.protocol)) return false;

  return (
    resolved.hostname === TRAKT_HOST ||
    resolved.hostname.endsWith(`.${TRAKT_HOST}`)
  );
}
