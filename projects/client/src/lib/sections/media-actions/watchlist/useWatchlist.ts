import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
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
  const { isQueued } = useIsQueued({
    domain: 'watchlist',
    keys: ids.map((id) => toMediaKey(type, id)),
  });
  const body = toBulkPayload(type, ids);

  const addToWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.next(true);
    track({ action: 'add' });

    const addResult = await executeOrEnqueue({
      endpoint: 'watchlist:add',
      keys: ids.map((id) => toMediaKey(type, id)),
      body,
      invalidations: [InvalidateAction.Watchlisted(type)],
    });

    if (addResult === 'executed') {
      await invalidate(InvalidateAction.Watchlisted(type));
    }

    // Always clear: a queued action stays flagged via isQueued, and leaving
    // this pinned would re-disable the button once it syncs and dequeues.
    isWatchlistUpdating.next(false);
  };

  const removeFromWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    isWatchlistUpdating.next(true);
    track({ action: 'remove' });

    const removeResult = await executeOrEnqueue({
      endpoint: 'watchlist:remove',
      keys: ids.map((id) => toMediaKey(type, id)),
      body,
      invalidations: [InvalidateAction.Watchlisted(type)],
    });

    if (removeResult === 'executed') {
      await invalidate(InvalidateAction.Watchlisted(type));
    }

    isWatchlistUpdating.next(false);
  };

  return {
    isWatchlistUpdating,
    isWatchlisted,
    isQueued,
    addToWatchlist,
    removeFromWatchlist,
  };
}
