import type { WatchlistStatus } from '$lib/sections/lists/watchlist/WatchlistStatus.ts';
import { useComingSoonList } from './useComingSoonList.ts';
import { useOutNowList } from './useOutNowList.ts';
import { useWatchList } from './useWatchList.ts';

export function statusToStore(status: WatchlistStatus) {
  switch (status) {
    case 'all':
      return useWatchList;
    case 'out-now':
      return useOutNowList;
    case 'coming-soon':
      return useComingSoonList;
  }
}
