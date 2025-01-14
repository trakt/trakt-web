import type { MediaType } from '$lib/models/MediaType.ts';
import {
  useWatchlistList,
} from '$lib/sections/lists/stores/useWatchlistList.ts';
import { derived } from 'svelte/store';

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
