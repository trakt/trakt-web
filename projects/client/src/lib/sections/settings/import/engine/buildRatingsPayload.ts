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

// Trakt ratings are 1-10. A third party dump that writes 0 for "unrated" must
// not be clamped up into a real 1/10 rating, so drop anything below the scale.
function toRating(rating: number): number | null {
  const rounded = Math.round(rating);
  if (rounded < 1) return null;
  return Math.min(10, rounded);
}

function toRatingsEntry(
  { ids, rating, rated_at }: UniversalImportItem,
  priority: IdPriority,
): RatingsEntry | null {
  if (rating == null) return null;
  const resolved = toRating(rating);
  if (resolved == null) return null;
  const resolvedIds = pickIds(ids, priority);
  if (!resolvedIds) return null;
  return {
    rating: resolved,
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
