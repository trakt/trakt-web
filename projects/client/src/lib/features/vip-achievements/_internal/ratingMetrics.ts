import type { UserRatings } from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { collectRatingValues } from './collectRatingValues.ts';

// Cohesive module of pure rating metric extractors. Trakt stores ratings on a
// 1-10 scale and shows them as 1-5 stars, two points per star.

const HOUR_MS = 3_600_000;
const LOW_RATING_MAX = 4;

const toStars = (rating: number): number => Math.ceil(rating / 2);

/** Different star levels (1 to 5) the member has rated with. */
export function countStarLevels(ratings: UserRatings | Nil): number {
  return new Set(collectRatingValues(ratings).map(toStars)).size;
}

/** Ratings of 1 or 2 stars. */
export function countLowRatings(ratings: UserRatings | Nil): number {
  return collectRatingValues(ratings).filter(
    (rating) => rating <= LOW_RATING_MAX,
  ).length;
}

type CountInstantVerdictsParams = {
  history: UserHistory | Nil;
  ratings: UserRatings | Nil;
};

/** Movies rated within an hour after one of their plays. */
export function countInstantVerdicts({
  history,
  ratings,
}: CountInstantVerdictsParams): number {
  if (!history || !ratings) {
    return 0;
  }

  return [...ratings.movies.values()].filter((rated) => {
    const plays = history.movies.get(rated.id)?.watchedDates ?? [];
    return plays.some((watchedAt) => {
      const gap = rated.ratedAt.getTime() - watchedAt.getTime();
      return gap >= 0 && gap <= HOUR_MS;
    });
  }).length;
}
