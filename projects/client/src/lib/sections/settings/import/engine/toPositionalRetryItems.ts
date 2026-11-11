import type { EpisodeMatchMode, UniversalImportItem } from '../ImportTypes.ts';
import { isPositionalItem } from '../isPositionalItem.ts';
import { pickIds, toEpisodeIdPriority } from './pickIds.ts';

type ToPositionalRetryItemsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  episodeMatch: EpisodeMatchMode;
};

export function toPositionalRetryItems({
  items,
  episodeMatch,
}: ToPositionalRetryItemsParams): UniversalImportItem[] {
  if (episodeMatch !== 'id') return [];

  return items
    .filter((item) => item.type === 'episode')
    .filter(isPositionalItem)
    .filter((item) => pickIds(item.ids, toEpisodeIdPriority(item)) != null);
}
