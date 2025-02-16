import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, get } from 'svelte/store';
import {
  useWatchlistList,
  type WatchListStoreProps,
} from './useWatchlistList.ts';
import { genreCompareFactory } from './utils/genreCompareFactory.ts';

export function useOutNowList(params: Omit<WatchListStoreProps, 'sort'>) {
  const { user } = useUser();

  const { list: watchlist, isLoading, page } = useWatchlistList({
    ...params,
    sort: 'released',
  });

  const { compare } = genreCompareFactory(
    get(user)?.genres ?? [],
    'desc',
    'genre',
  );

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => item?.airDate.getTime() <= Date.now())
        .sort(compare),
  );

  return {
    list,
    isLoading,
    page,
  };
}
