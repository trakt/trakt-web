import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import {
  useWatchList,
  type WatchListStoreProps,
} from '$lib/sections/lists/watchlist/useWatchList.ts';
import { derived, get } from 'svelte/store';
import { genreCompareFactory } from './utils/genreCompareFactory.ts';

/*
  For unreleased lists, we consider 'released' also.
  Depending on the region, an item may be released in general,
  but not yet in a particular region.
*/
const VALID_STATUSES: MediaStatus[] = [
  'planned',
  'post production',
  'in production',
  'upcoming',
  'released',
] as const;

export function useUnreleasedList(params: Omit<WatchListStoreProps, 'sort'>) {
  const { list: watchlist, isLoading, page } = useWatchList({
    ...params,
    sort: 'rank',
  });

  const { user } = useUser();

  const { compare } = genreCompareFactory(
    get(user)?.genres ?? [],
    'asc',
    'year',
  );

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => {
          const isUpcomingItem = item.airDate.getTime() > Date.now();
          const hasValidStatus = VALID_STATUSES.includes(item.status);

          return isUpcomingItem && hasValidStatus;
        })
        .sort(compare),
  );

  return {
    list,
    isLoading,
    page,
  };
}
