import type { RatingsSyncRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

export function buildRatingsPayload(
  items: UniversalImportItem[],
): RatingsSyncRequest {
  const movies: NonNullable<RatingsSyncRequest['movies']> = [];
  const shows: NonNullable<RatingsSyncRequest['shows']> = [];

  for (const { type, ids, rating } of items) {
    if (rating == null) continue;
    const clampedRating = Math.min(10, Math.max(1, Math.round(rating)));

    switch (type) {
      case 'movie': {
        const resolvedIds = pickIds(ids, MOVIE_IDS);
        if (resolvedIds) {
          movies.push({ rating: clampedRating, ids: resolvedIds as never });
        }
        break;
      }
      case 'show': {
        const resolvedIds = pickIds(ids, SHOW_IDS);
        if (resolvedIds) {
          shows.push({ rating: clampedRating, ids: resolvedIds as never });
        }
        break;
      }
    }
  }

  return { movies, shows };
}
