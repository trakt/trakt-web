import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { derived } from 'svelte/store';
import { useWatchlistList } from './useWatchlistList.ts';

export function useOutNow(type: MediaType) {
  const { list: watchlist, isLoading } = useWatchlistList({
    type,
    sort: 'released',
  });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist.filter((item) => item?.airDate.getTime() <= Date.now())
        .sort((a, b) => a.airDate.getTime() - b.airDate.getTime()),
  );

  return {
    list,
    isLoading,
  };
}
