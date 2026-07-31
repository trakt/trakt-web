import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';

/**
 * Flatten every rating score (1-10) the member has given across movies, shows,
 * seasons and episodes. Empty when ratings haven't loaded.
 */
export function collectRatingValues(ratings: UserRatings | Nil): number[] {
  if (!ratings) {
    return [];
  }

  return [ratings.movies, ratings.shows, ratings.seasons, ratings.episodes]
    .flatMap((map) => [...map.values()].map((entry) => entry.rating));
}
