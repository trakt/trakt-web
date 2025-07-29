import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { derived, get } from 'svelte/store';
import { useWatchList, type WatchListStoreProps } from './useWatchList.ts';
import { genreCompareFactory } from './utils/genreCompareFactory.ts';

// FIXME remove when sorting is fixed
const RELEASED_LIST_LIMIT = 500;

export function useReleasedList(params: Omit<WatchListStoreProps, 'sort'>) {
  const { user } = useUser();

  const { list: watchlist, isLoading, page } = useWatchList({
    ...params,
    sort: 'released',
    limit: RELEASED_LIST_LIMIT,
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
