import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import {
  useWatchList,
  type WatchListStoreProps,
} from '$lib/sections/lists/watchlist/useWatchList.ts';
import { derived, get } from 'svelte/store';
import { genreCompareFactory } from './utils/genreCompareFactory.ts';

const IN_PROGRESS_STATUSES: MediaStatus[] = [
  'planned',
  'post production',
  'in production',
  'upcoming',
] as const;

export function useComingSoonList(params: Omit<WatchListStoreProps, 'sort'>) {
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
          const isInProgressItem = IN_PROGRESS_STATUSES.includes(item.status);

          return isUpcomingItem && isInProgressItem;
        })
        .sort(compare),
  );

  return {
    list,
    isLoading,
    page,
  };
}
