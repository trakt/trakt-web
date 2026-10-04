import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export function isTrendingShareImage(url: URL): boolean {
  return url.pathname === UrlBuilder.api.trendingShareableImagePath();
}
