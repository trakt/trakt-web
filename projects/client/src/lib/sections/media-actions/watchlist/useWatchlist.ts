import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';
import { useIsWatchlisted } from './useIsWatchlisted.ts';

type UseWatchlistProps = MediaStoreProps & { title: string };
export function useWatchlist(props: UseWatchlistProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isWatchlistUpdating = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Watchlist);
  const { confirm } = useConfirm();

  const ids = media.map(({ id }) => id);

  const { isWatchlisted } = useIsWatchlisted(props);
  const body = toBulkPayload(type, ids);

  const addToWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.set(true);
    track({ action: 'add' });

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
    track({ action: 'remove' });

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
    removeFromWatchlist: confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title: props.title,
      onConfirm: removeFromWatchlist,
    }),
  };
}
