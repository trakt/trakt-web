import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { addToWatchlistRequest } from '$lib/requests/sync/addToWatchlistRequest.ts';
import { removeFromWatchlistRequest } from '$lib/requests/sync/removeFromWatchlistRequest.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
import { BehaviorSubject } from 'rxjs';

export function useWatchlist(props: MediaStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isWatchlistUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Watchlist);

  const ids = media.map(({ id }) => id);

  const { isWatchlisted } = useIsWatchlisted(props);
  const body = toBulkPayload(type, ids);

  const addToWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.next(true);
    track({ action: 'add' });

    await addToWatchlistRequest({
      body,
    });

    await invalidate(InvalidateAction.Watchlisted(type));

    isWatchlistUpdating.next(false);
  };

  const removeFromWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.next(true);
    track({ action: 'remove' });

    await removeFromWatchlistRequest({
      body,
    });

    await invalidate(InvalidateAction.Watchlisted(type));

    isWatchlistUpdating.next(false);
  };

  return {
    isWatchlistUpdating,
    isWatchlisted,
    addToWatchlist,
    removeFromWatchlist,
  };
}
