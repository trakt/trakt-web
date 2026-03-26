import type { RatingsSyncRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

type RatingsMovie = NonNullable<RatingsSyncRequest['movies']>[number];
type RatingsShow = NonNullable<RatingsSyncRequest['shows']>[number];

function clampRating(rating: number): number {
  return Math.min(10, Math.max(1, Math.round(rating)));
}

function toRatingsMovie(
  { ids, rating }: UniversalImportItem,
): RatingsMovie | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, MOVIE_IDS);
  if (!resolvedIds) return null;
  return { rating: clampRating(rating), ids: resolvedIds as never };
}

function toRatingsShow(
  { ids, rating }: UniversalImportItem,
): RatingsShow | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, SHOW_IDS);
  if (!resolvedIds) return null;
  return { rating: clampRating(rating), ids: resolvedIds as never };
}

export function buildRatingsPayload(
  items: UniversalImportItem[],
): RatingsSyncRequest {
  const movies = items
    .filter((item) => item.type === 'movie')
    .flatMap((item) => toRatingsMovie(item) ?? []);

  const shows = items
    .filter((item) => item.type === 'show')
    .flatMap((item) => toRatingsShow(item) ?? []);

  return { movies, shows };
}
