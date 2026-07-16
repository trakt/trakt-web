import { toCountrySlugs } from './toCountrySlugs.ts';

type FilterActiveFavoritesParams = {
  favorites: ReadonlyArray<string>;
  country: string;
  activeSources: ReadonlyArray<{ source: string }> | Nil;
};

/**
 * Filter a user's favorite streaming service slugs for a specific country,
 * keeping only those that are currently active in the country's sources.
 */
export function filterActiveFavorites({
  favorites,
  country,
  activeSources,
}: FilterActiveFavoritesParams): string[] {
  const rawSlugs = toCountrySlugs(favorites, country);
  if (rawSlugs.length === 0) {
    return [];
  }
  if (activeSources == null) {
    return rawSlugs;
  }
  const activeSlugs = new Set(activeSources.map((s) => s.source));
  return rawSlugs.filter((slug) => activeSlugs.has(slug));
}
