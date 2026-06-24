import { toWatchNowSource } from './toWatchNowSource.ts';

type ToFavoritesWithConnectionParams = {
  serviceId: string;
  country: string;
  favorites: ReadonlyArray<string>;
};

/**
 * Adds a freshly-connected younify service to the watch-now favorites list.
 *
 * The younify connection id is mapped onto its watch-now source slug (reusing
 * `toWatchNowSource`) and stored as a country-prefixed favorite, e.g.
 * `us-disney_plus`. Returns `null` when the service is already a favorite so
 * the caller can skip a redundant save.
 */
export function toFavoritesWithConnection(
  { serviceId, country, favorites }: ToFavoritesWithConnectionParams,
): string[] | null {
  const favoriteId = `${country}-${toWatchNowSource(serviceId)}`;

  if (favorites.includes(favoriteId)) {
    return null;
  }

  return [...favorites, favoriteId];
}
