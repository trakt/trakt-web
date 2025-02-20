import type { WatchlistStatus } from '$lib/sections/lists/watchlist/WatchlistStatus.ts';
import { useReleasedList } from './useReleasedList.ts';
import { useUnreleasedList } from './useUnreleasedList.ts';
import { useWatchList } from './useWatchList.ts';

export function statusToStore(status: WatchlistStatus) {
  switch (status) {
    case 'all':
      return useWatchList;
    case 'released':
      return useReleasedList;
    case 'unreleased':
      return useUnreleasedList;
  }
}
