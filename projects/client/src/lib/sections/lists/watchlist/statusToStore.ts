import type { WatchlistStatus } from '$lib/sections/lists/watchlist/WatchlistStatus.ts';
import { useReleasedList } from './useReleasedList.ts';
import { useWatchList } from './useWatchList.ts';

export function statusToStore(status: WatchlistStatus) {
  switch (status) {
    case 'all':
      return useWatchList;
    case 'released':
      return useReleasedList;
  }
}
