import type { RatingsSyncRequest } from '@trakt/api';
import type { ImportType, UniversalImportItem } from '../ImportTypes.ts';
import {
  type IdPriority,
  MOVIE_IDS,
  pickIds,
  type ResolvedIds,
  SEASON_IDS,
  SHOW_IDS,
  toEpisodeIdPriority,
} from './pickIds.ts';

type RatingsEntry = {
  rating: number;
  ids: ResolvedIds;
  rated_at?: string;
};

function clampRating(rating: number): number {
  return Math.min(10, Math.max(1, Math.round(rating)));
}

function toRatingsEntry(
  { ids, rating, rated_at }: UniversalImportItem,
  priority: IdPriority,
): RatingsEntry | null {
  if (rating == null) return null;
  const resolvedIds = pickIds(ids, priority);
  if (!resolvedIds) return null;
  return {
    rating: clampRating(rating),
    ids: resolvedIds,
    ...(rated_at ? { rated_at } : {}),
  };
}

export function buildRatingsPayload(
  items: ReadonlyArray<UniversalImportItem>,
): RatingsSyncRequest {
  const collect = (
    type: ImportType,
    toPriority: (item: UniversalImportItem) => IdPriority,
  ) =>
    items
      .filter((item) => item.type === type)
      .flatMap((item) => toRatingsEntry(item, toPriority(item)) ?? []);

  return {
    movies: collect('movie', () => MOVIE_IDS),
    shows: collect('show', () => SHOW_IDS),
    seasons: collect('season', () => SEASON_IDS),
    episodes: collect('episode', toEpisodeIdPriority),
  } as RatingsSyncRequest;
}
