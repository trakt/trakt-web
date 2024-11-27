import type { MediaType } from '$lib/models/MediaType.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { SvelteMap } from 'svelte/reactivity';
import { toWatchlistPayload } from './_internal/toWatchlistPayload.ts';

type WatchlistStoreProps = {
  type: MediaType;
};

const watchlistKey = (id: number) => `watchlist_${id}`;

export function useWatchlist({ type }: WatchlistStoreProps) {
  const loadingMap = new SvelteMap<number, boolean>();
  const isLoading = (id: number) => loadingMap.get(id) ?? false;

  const watchlistMap = new SvelteMap<number, boolean>();
  const isWatchlisted = (id: number) => {
    return watchlistMap.get(id) ??
      // FIXME: populate using user data
      localStorage.getItem(watchlistKey(id)) === 'true';
  };

  const add = async (ids: number[] | number) => {
    ids = Array.isArray(ids) ? ids : [ids];

    ids.forEach((id) => loadingMap.set(id, true));
    const result = await addToWatchlistRequest({
      body: toWatchlistPayload(type, ids),
    });
    ids.forEach((id) => loadingMap.set(id, false));

    ids.forEach((id) => {
      watchlistMap.set(id, result);
      // FIXME: populate using user data
      localStorage.setItem(watchlistKey(id), result.toString());
    });
  };

  return {
    isLoading,
    isWatchlisted,
    add,
  };
}
