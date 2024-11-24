import type { MediaType } from '$lib/models/MediaType.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { SvelteMap } from 'svelte/reactivity';

function typeToPayload(type: MediaType, ids: number[]) {
  const mappedIds = ids.map((id) => ({ ids: { trakt: id } }));

  switch (type) {
    case 'movie':
      return {
        movies: mappedIds,
      };
    case 'show':
      return {
        shows: mappedIds,
      };
  }
}

type WatchlistStoreProps = {
  type: MediaType;
};

export function useWatchlist({ type }: WatchlistStoreProps) {
  const loadingMap = new SvelteMap<number, boolean>();
  const isLoading = (id: number) => loadingMap.get(id) ?? false;

  const watchlistMap = new SvelteMap<number, boolean>();
  const isWatchlisted = (id: number) => watchlistMap.get(id) ?? false;

  const add = async (ids: number[]) => {
    ids.forEach((id) => loadingMap.set(id, true));
    const result = await addToWatchlistRequest({
      body: typeToPayload(type, ids),
    });
    ids.forEach((id) => loadingMap.set(id, false));

    ids.forEach((id) => watchlistMap.set(id, result));
  };

  return {
    isLoading,
    isWatchlisted,
    add,
  };
}
