import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import {
  useWatchList,
  type WatchListStoreProps,
} from '$lib/sections/lists/watchlist/useWatchList.ts';
import { isMaxDate } from '$lib/utils/date/isMaxDate.ts';
import { derived } from 'svelte/store';

// FIXME remove when sorting is fixed
const UNRELEASED_LIST_LIMIT = 500;

const VALID_STATUSES: MediaStatus[] = [
  'planned',
  'post production',
  'in production',
  'upcoming',
] as const;

export function useUnreleasedList(params: Omit<WatchListStoreProps, 'sort'>) {
  const { list: watchlist, isLoading, page } = useWatchList({
    ...params,
    sort: 'released',
    limit: UNRELEASED_LIST_LIMIT,
  });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => {
          const isUpcomingItem = item.airDate.getTime() > Date.now();
          /*
            For unreleased lists, we consider 'released' also.
            Depending on the region, an item may be released in general,
            but not yet in a particular region.
          */
          const isUpcomingReleasedItem = item.status === 'released' &&
            !isMaxDate(item.airDate);

          const hasValidStatus = VALID_STATUSES.includes(item.status) ||
            isUpcomingReleasedItem;

          return isUpcomingItem && hasValidStatus;
        })
        // FIXME: add sorting/filter support to api, or switch to calendar api
        .sort((a, b) => a.airDate.getTime() - b.airDate.getTime()),
  );

  return {
    list,
    isLoading,
    page,
  };
}
