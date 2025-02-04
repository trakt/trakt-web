import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import {
  useWatchlistList,
} from '$lib/sections/lists/watchlist/useWatchlistList';
import { derived } from 'svelte/store';

// TODO use drilledmedia list for this
const COMING_SOON_LIMIT = 500;

const IN_PROGRESS_STATUSES: MediaStatus[] = [
  'planned',
  'post production',
  'in production',
  'upcoming',
] as const;

export function useComingSoon(type: MediaType) {
  const { list: watchlist, isLoading } = useWatchlistList({
    type,
    sort: 'unreleased',
    limit: COMING_SOON_LIMIT,
  });

  const list = derived(
    watchlist,
    ($watchlist) =>
      $watchlist
        .filter((item) => {
          const isUpcomingItem = item.airDate.getTime() > Date.now();
          const isInProgressItem = IN_PROGRESS_STATUSES.includes(item.status);

          return isUpcomingItem && isInProgressItem;
        })
        .sort((a, b) => a.airDate.getTime() - b.airDate.getTime()),
  );

  return {
    list,
    isLoading,
  };
}
