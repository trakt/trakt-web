const NO_STORE = 'private, no-store, no-cache, must-revalidate';

const SESSION_DEPENDENT_PATHS = new Set(['/']);

type ResolveCacheControlParams = {
  pathname: string;
  isRedirect: boolean;
  hasWebviewParam: boolean;
  isLegitimateBot: boolean;
  isSocialBot: boolean;
  hasSession: boolean;
};

export function resolveCacheControl({
  pathname,
  isRedirect,
  hasWebviewParam,
  isLegitimateBot,
  isSocialBot,
  hasSession,
}: ResolveCacheControlParams): string {
  if (isRedirect) {
    return NO_STORE;
  }

  // A WebView request carries the viewer's VIP token in the URL. Never let a
  // spoofed bot User-Agent promote the response to a public CDN entry (keyed
  // by the token), which would cache one viewer's review for others.
  if (hasWebviewParam) {
    return NO_STORE;
  }

  // The response body depends on the session, and no `Vary` keys the shared
  // cache on it. A public entry would be replayed to the wrong audience.
  if (SESSION_DEPENDENT_PATHS.has(pathname)) {
    return NO_STORE;
  }

  // Verified search engine crawlers (via Cloudflare), full CDN caching for SEO
  if (isLegitimateBot) {
    return 'public, max-age=3600, s-maxage=3600';
  }

  // Social bots (Discord, Slack, etc.) need a cacheable response to render embeds.
  if (isSocialBot && !hasSession) {
    return 'private, max-age=120';
  }

  return NO_STORE;
}
