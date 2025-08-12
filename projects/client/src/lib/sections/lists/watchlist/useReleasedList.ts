import { derived } from 'svelte/store';
import { useWatchList, type WatchListStoreProps } from './useWatchList.ts';

// FIXME remove when sorting is fixed
const RELEASED_LIST_LIMIT = 500;

export function useReleasedList(params: Omit<WatchListStoreProps, 'sort'>) {
  const { list: watchlist, isLoading, page } = useWatchList({
    ...params,
    sort: 'released',
    limit: RELEASED_LIST_LIMIT,
  });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => item?.airDate.getTime() <= Date.now()),
  );

  return {
    list,
    isLoading,
    page,
  };
}
