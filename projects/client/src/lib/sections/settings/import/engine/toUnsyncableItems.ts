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

export function toUnsyncableItems(
  items: ReadonlyArray<UniversalImportItem>,
  episodeMatch: EpisodeMatchMode = DEFAULT_EPISODE_MATCH_MODE,
): ReadonlyArray<UniversalImportItem> {
  return items.filter((item) => !isRepresented(toPayload(item, episodeMatch)));
}
