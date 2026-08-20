import type { RatingsSyncRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import {
  EPISODE_IDS,
  MOVIE_IDS,
  pickIds,
  SEASON_IDS,
  SHOW_IDS,
} from './pickIds.ts';

type RatingsMovie = NonNullable<RatingsSyncRequest['movies']>[number];
type RatingsShow = NonNullable<RatingsSyncRequest['shows']>[number];
type RatingsSeason = NonNullable<RatingsSyncRequest['seasons']>[number];
type RatingsEpisode = NonNullable<RatingsSyncRequest['episodes']>[number];

function clampRating(rating: number): number {
  return Math.min(10, Math.max(1, Math.round(rating)));
}

function toRatingsMovie(
  { ids, rating, rated_at }: UniversalImportItem,
): RatingsMovie | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, MOVIE_IDS);
  if (!resolvedIds) return null;
  return {
    rating: clampRating(rating),
    ids: resolvedIds as never,
    ...(rated_at ? { rated_at } : {}),
  };
}

function toRatingsShow(
  { ids, rating, rated_at }: UniversalImportItem,
): RatingsShow | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, SHOW_IDS);
  if (!resolvedIds) return null;
  return {
    rating: clampRating(rating),
    ids: resolvedIds as never,
    ...(rated_at ? { rated_at } : {}),
  };
}

function toRatingsSeason(
  { ids, rating, rated_at }: UniversalImportItem,
): RatingsSeason | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, SEASON_IDS);
  if (!resolvedIds) return null;
  return {
    rating: clampRating(rating),
    ids: resolvedIds as never,
    ...(rated_at ? { rated_at } : {}),
  };
}

function toRatingsEpisode(
  { ids, rating, rated_at }: UniversalImportItem,
): RatingsEpisode | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, EPISODE_IDS);
  if (!resolvedIds) return null;
  return {
    rating: clampRating(rating),
    ids: resolvedIds as never,
    ...(rated_at ? { rated_at } : {}),
  };
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

  const seasons = items
    .filter((item) => item.type === 'season')
    .flatMap((item) => toRatingsSeason(item) ?? []);

  const episodes = items
    .filter((item) => item.type === 'episode')
    .flatMap((item) => toRatingsEpisode(item) ?? []);

  return { movies, shows, seasons, episodes };
}
