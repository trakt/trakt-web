import {
  DEFAULT_EPISODE_MATCH_MODE,
  type EpisodeMatchMode,
  type UniversalImportItem,
} from '../ImportTypes.ts';
import { buildHistoryPayload } from './buildHistoryPayload.ts';
import { buildRatingsPayload } from './buildRatingsPayload.ts';
import { buildWatchlistPayload } from './buildWatchlistPayload.ts';

function toPayload(
  item: UniversalImportItem,
  episodeMatch: EpisodeMatchMode,
): Record<string, unknown> {
  switch (item.action) {
    case 'history':
      return buildHistoryPayload([item], episodeMatch);
    case 'ratings':
      return buildRatingsPayload([item]);
    default:
      return buildWatchlistPayload([item]);
  }
}

function isRepresented(payload: Record<string, unknown>): boolean {
  return Object.values(payload).some(
    (bucket) => Array.isArray(bucket) && bucket.length > 0,
  );
}

/**
 * Items the payload builders cannot express, and which would therefore never
 * reach Trakt: a movie with no usable id, an episode whose id Trakt does not
 * accept and that carries no positional fallback, an episode rating (ratings
 * and watchlist payloads only carry movies and shows).
 *
 * Asking the real builders keeps this in step with them - there is no second
 * copy of the rules to drift.
 */
export function toUnsyncableItems(
  items: ReadonlyArray<UniversalImportItem>,
  episodeMatch: EpisodeMatchMode = DEFAULT_EPISODE_MATCH_MODE,
): ReadonlyArray<UniversalImportItem> {
  return items.filter((item) => !isRepresented(toPayload(item, episodeMatch)));
}
