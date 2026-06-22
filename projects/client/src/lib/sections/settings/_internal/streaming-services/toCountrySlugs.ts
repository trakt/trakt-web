/**
 * Inverse of `toFavoriteId`: given the full favorites list, return the bare
 * source slugs that belong to `country` (e.g. "us-netflix" -> "netflix"),
 * dropping favorites stored for any other country.
 */
export function toCountrySlugs(
  favorites: ReadonlyArray<string>,
  country: string,
): string[] {
  const prefix = `${country}-`;

  return favorites
    .filter((id) => id.startsWith(prefix))
    .map((id) => id.slice(prefix.length));
}
