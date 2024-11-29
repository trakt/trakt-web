import type { MediaType } from '$lib/models/MediaType.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { writable } from 'svelte/store';
import { toWatchlistPayload } from './_internal/toWatchlistPayload.ts';

type WatchlistStoreProps = {
  type: MediaType;
  id: number;
};

const watchlistKey = (id: number) => `watchlist_${id}`;

export function useWatchlist({ type, id }: WatchlistStoreProps) {
  const isAddingToWatchlist = writable(false);

  const isWatchlisted = writable(
    localStorage.getItem(watchlistKey(id)) === 'true',
  );

  const watchlist = async () => {
    isAddingToWatchlist.set(true);
    const result = await addToWatchlistRequest({
      body: toWatchlistPayload(type, [id]),
    });
    isAddingToWatchlist.set(false);
    isWatchlisted.set(result);
    localStorage.setItem(watchlistKey(id), result.toString());
  };

  return {
    isAddingToWatchlist,
    isWatchlisted,
    watchlist,
  };
}
