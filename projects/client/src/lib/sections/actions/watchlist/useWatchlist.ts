import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaType } from '$lib/models/MediaType.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { toWatchlistPayload } from '$lib/sections/actions/watchlist/toWatchlistPayload';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

export type WatchlistStoreProps = {
  type: MediaType;
  media: { id: number };
};

export function useWatchlist({ type, media }: WatchlistStoreProps) {
  const isWatchlistUpdating = writable(false);
  const { watchlist } = useUser();
  const { invalidate } = useInvalidator();

  /**
   *  TODO: implement some sort of in-memory cache for result of action response
   *  that will allow to show optimistic UI updates while history is being updated
   */
  const isWatchlisted = derived(
    watchlist,
    ($watchlist) => {
      if (!$watchlist) {
        return false;
      }

      switch (type) {
        case 'movie':
          return $watchlist.movies.has(media.id);
        case 'show':
          return $watchlist.shows.has(media.id);
      }
    },
  );

  const addToWatchlist = async () => {
    isWatchlistUpdating.set(true);
    await addToWatchlistRequest({
      body: toWatchlistPayload(type, [media.id]),
    });
    isWatchlistUpdating.set(false);

    await invalidate(InvalidateAction.Watchlisted(type));
  };

  const removeFromWatchlist = async () => {
    isWatchlistUpdating.set(true);
    await removeFromWatchlistRequest({
      body: toWatchlistPayload(type, [media.id]),
    });
    isWatchlistUpdating.set(false);

    await invalidate(InvalidateAction.Watchlisted(type));
  };

  return {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  };
}
