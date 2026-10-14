import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import type { UserNetwork } from '$lib/features/auth/queries/currentUserNetworkQuery.ts';
import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserWatchlist } from '$lib/features/auth/queries/currentUserWatchlistQuery.ts';
import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import type { NextStepSignals } from './NextStepSignals.ts';

type ToNextStepSignalsParams = {
  user: Pick<UserSettings, 'genres' | 'services'> | Nil;
  watchlist: UserWatchlist | Nil;
  ratings: UserRatings | Nil;
  network: UserNetwork | Nil;
  connections: ReadonlyArray<StreamingConnection> | Nil;
  watchedCount: number | Nil;
  listsCount: number | Nil;
  commentsCount: number | Nil;
};

function toRatingsCount(ratings: UserRatings): number {
  return ratings.movies.size +
    ratings.shows.size +
    ratings.seasons.size +
    ratings.episodes.size;
}

// Favorites are stored as "us-netflix". Older accounts may still hold bare
// slugs ("netflix"), which the streaming filter also accepts.
const COUNTRY_PREFIX = /^[a-z]{2}-/;

function toFavoriteServicesCount(
  services: UserSettings['services'],
): number {
  const favorites = services.favorites ?? [];
  if (!services.country) return favorites.length;

  const countryPrefix = `${services.country}-`;
  return favorites
    .filter((id) => id.startsWith(countryPrefix) || !COUNTRY_PREFIX.test(id))
    .length;
}

/**
 * Collapses the member's own API data into the counts the next-steps pool
 * reads. Every source is available to free members. Returns `null` until
 * every source has settled, so the pool is never evaluated on partial data.
 */
export function toNextStepSignals(
  params: ToNextStepSignalsParams,
): NextStepSignals | null {
  const {
    user,
    watchlist,
    ratings,
    network,
    connections,
    watchedCount,
    listsCount,
    commentsCount,
  } = params;

  if (!user || !watchlist || !ratings || !network || !connections) {
    return null;
  }
  if (watchedCount == null || listsCount == null || commentsCount == null) {
    return null;
  }

  return {
    watchedCount,
    watchlistCount: watchlist.movies.size + watchlist.shows.size,
    ratingsCount: toRatingsCount(ratings),
    lovedGenresCount: user.genres.loved.length,
    favoriteServicesCount: toFavoriteServicesCount(user.services),
    streamingConnectionsCount: connections
      .filter((connection) => connection.isConnected)
      .length,
    followingCount: network.following.length,
    listsCount,
    commentsCount,
  };
}
