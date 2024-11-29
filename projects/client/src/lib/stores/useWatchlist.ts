import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { derived, writable } from 'svelte/store';
import { toWatchlistPayload } from './_internal/toWatchlistPayload.ts';

type WatchlistStoreProps = {
  type: MediaType;
  id: number;
};

const watchlistKey = (id: number) => `watchlist_${id}`;

export function useWatchlist({ type, id }: WatchlistStoreProps) {
  const isWatchlistUpdating = writable(false);
  const { watchlist } = useUser();
  const cached = localStorage.getItem(watchlistKey(id)) == 'true';

  const _isWatchlisted = writable(false);
  const isWatchlisted = derived(
    [watchlist, _isWatchlisted],
    ([$watchlist, $_isWatchlisted]) => {
      if (!$watchlist) {
        return cached;
      }

      switch (type) {
        case 'movie':
          return $watchlist.movies.has(id) || $_isWatchlisted;
        case 'episode':
          return false;
        case 'show':
          return $watchlist.shows.has(id) || $_isWatchlisted;
      }
    },
  );

  const addToWatchlist = async () => {
    isWatchlistUpdating.set(true);
    const result = await addToWatchlistRequest({
      body: toWatchlistPayload(type, [id]),
    });
    isWatchlistUpdating.set(false);
    _isWatchlisted.set(result);
  };

  const removeFromWatchlist = async () => {
    isWatchlistUpdating.set(true);
    const result = await removeFromWatchlistRequest({
      body: toWatchlistPayload(type, [id]),
    });
    isWatchlistUpdating.set(false);
    _isWatchlisted.set(!result);
  };

  derived(
    [isWatchlisted, _isWatchlisted],
    ([$isWatchlisted, $_isWatchlisted]) => $isWatchlisted || $_isWatchlisted,
  )
    .subscribe((value) =>
      localStorage.setItem(watchlistKey(id), value.toString())
    );

  return {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  };
}
