import type { WatchlistStatus } from '$lib/sections/lists/watchlist/WatchlistStatus.ts';
import { useComingSoonList } from './useComingSoonList.ts';
import { useOutNowList } from './useOutNowList.ts';
import { useWatchlistList } from './useWatchlistList.ts';

export function statusToStore(status: WatchlistStatus) {
  switch (status) {
    case 'all':
      return useWatchlistList;
    case 'out-now':
      return useOutNowList;
    case 'coming-soon':
      return useComingSoonList;
  }
}
