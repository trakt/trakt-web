import { undoToastAction } from '$lib/features/action-toast/undoToastAction.ts';
import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { manageListsDrawerStore } from '$lib/sections/components/lists-drawer/manageListsDrawerStore.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
import { BehaviorSubject } from 'rxjs';

// The "change list" drawer needs a full entry; bulk mutations may only carry
// an `{ id }`.
function isListableEntry(item: { id: number }): item is MediaEntry {
  const candidate = item as Partial<MediaEntry>;

  return (candidate.type === 'movie' || candidate.type === 'show') &&
    typeof candidate.slug === 'string' &&
    typeof candidate.title === 'string';
}

export function useWatchlist(props: MediaStoreProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const isWatchlistUpdating = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.Watchlist);
  const { notify } = useActionToast();

  const ids = media.map(({ id }) => id);

  const soleItem = media.length === 1 ? media.at(0) : undefined;
  const singleEntry = soleItem && isListableEntry(soleItem)
    ? soleItem
    : undefined;

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

    notify({
      message: singleEntry
        ? m.action_toast_added_to_watchlist({ title: singleEntry.title })
        : m.action_toast_added_to_watchlist_generic(),
      action: singleEntry
        ? {
          text: m.action_toast_action_change_list(),
          label: m.action_toast_label_change_list({ title: singleEntry.title }),
          onAction: () =>
            manageListsDrawerStore.open({
              media: singleEntry,
              title: singleEntry.title,
            }),
        }
        : undefined,
    });

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

    notify({
      message: singleEntry
        ? m.action_toast_removed_from_watchlist({ title: singleEntry.title })
        : m.action_toast_removed_from_watchlist_generic(),
      action: undoToastAction(addToWatchlist),
    });

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
