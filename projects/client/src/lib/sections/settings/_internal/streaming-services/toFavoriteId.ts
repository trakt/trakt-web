/**
 * Favorites are stored as country-prefixed source slugs (e.g. "us-netflix"),
 * matching `getGroupedServices` / `user.services.favorites`.
 */
export function toFavoriteId(country: string, source: string): string {
  return `${country}-${source}`;
}
