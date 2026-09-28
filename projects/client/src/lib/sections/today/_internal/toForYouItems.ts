import type { UpNextEntry } from '$lib/requests/models/UpNextEntry.ts';
import type { WatchlistedItem } from '$lib/requests/queries/users/watchlistQuery.ts';
import { isInDateRange } from '$lib/utils/date/isInDateRange.ts';
import type { TodayForYouItem } from '../models/TodayForYouItem.ts';
import type { TodayRange } from '../models/TodayRange.ts';

type ToForYouItemsParams = {
  upNext: ReadonlyArray<UpNextEntry>;
  watchlist: ReadonlyArray<WatchlistedItem>;
  range: TodayRange;
};

export function toForYouItems(
  { upNext, watchlist, range }: ToForYouItemsParams,
): TodayForYouItem[] {
  const { start, end } = range;

  const newEpisodes = upNext
    .filter((entry) => isInDateRange(entry.effectiveReleaseDate, start, end))
    .map((entry): TodayForYouItem => ({
      key: `up-next-${entry.show.id}-${entry.id}`,
      type: 'up-next',
      entry,
    }));

  const releases = watchlist
    .flatMap((item) =>
      item.type === 'movie' || item.type === 'show' ? [item.entry] : []
    )
    .filter((media) => isInDateRange(media.effectiveReleaseDate, start, end))
    .map((media): TodayForYouItem => ({
      key: `start-watching-${media.type}-${media.id}`,
      type: 'start-watching',
      media,
    }));

  return [...newEpisodes, ...releases];
}
