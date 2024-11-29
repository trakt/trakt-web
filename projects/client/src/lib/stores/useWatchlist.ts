import type { MediaType } from '$lib/models/MediaType.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { writable } from 'svelte/store';
import { toWatchlistPayload } from './_internal/toWatchlistPayload.ts';

type WatchlistStoreProps = {
  type: MediaType;
  id: number | Nil;
};

const watchlistKey = (id: number) => `watchlist_${id}`;

export function useWatchlist({ type, id }: WatchlistStoreProps) {
  const isAddingToWatchlist = writable(false);

  const isWatchlisted = writable(
    id != null && !!localStorage.getItem(watchlistKey(id)),
  );

  const watchlist = async (id: number) => {
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
