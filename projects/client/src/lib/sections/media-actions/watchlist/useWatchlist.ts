import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';
import { useIsWatchlisted } from './useIsWatchlisted.ts';

export function useWatchlist(props: MediaStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isWatchlistUpdating = writable(false);
  const { invalidate } = useInvalidator();
  const ids = media.map(({ id }) => id);

  const { isWatchlisted } = useIsWatchlisted(props);
  const body = toBulkPayload(type, ids);

  const addToWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.set(true);
    await addToWatchlistRequest({
      body,
    });

    await invalidate(InvalidateAction.Watchlisted(type));

    isWatchlistUpdating.set(false);
  };

  const removeFromWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.set(true);
    await removeFromWatchlistRequest({
      body,
    });

    await invalidate(InvalidateAction.Watchlisted(type));

    isWatchlistUpdating.set(false);
  };

  return {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  };
}
