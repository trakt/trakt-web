import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

const WHITELISTED_PATHS = [
  '/shows',
  '/movies',
  '/users',
  '/lists',
  '/people',
] as const;

export function navigateToTraktOg() {
  const currentPath = globalThis.window.location.pathname;

  const isWhitelisted = WHITELISTED_PATHS.some((prefix) =>
    currentPath.startsWith(prefix)
  );

  const targetUrl = isWhitelisted
    ? `${UrlBuilder.og.site()}${currentPath}`
    : UrlBuilder.og.site();

  globalThis.window.location.assign(targetUrl);
}
