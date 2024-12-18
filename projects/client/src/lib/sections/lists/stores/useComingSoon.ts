import type { MediaType } from '$lib/models/MediaType.ts';
import {
  useWatchlistList,
} from '$lib/sections/lists/stores/useWatchlistList.ts';
import { derived } from 'svelte/store';

export function useComingSoon(type: MediaType) {
  const { list: watchlist } = useWatchlistList({ type, sort: 'unreleased' });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist.filter((item) => item?.airedDate.getTime() > Date.now())
        .sort((a, b) => a.airedDate.getTime() - b.airedDate.getTime()),
  );

  return {
    list,
  };
}
