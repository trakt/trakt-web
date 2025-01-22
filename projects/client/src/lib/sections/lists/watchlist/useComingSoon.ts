import type { MediaStatus } from '$lib/requests/models/MediaStatus';
import type { MediaType } from '$lib/requests/models/MediaType';
import {
  useWatchlistList,
} from '$lib/sections/lists/watchlist/useWatchlistList';
import { derived } from 'svelte/store';

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
