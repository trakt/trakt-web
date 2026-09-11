import { undoToastAction } from '$lib/features/action-toast/undoToastAction.ts';
import { toGatedNotify } from '$lib/features/action-toast/toGatedNotify.ts';
import { useActionToast } from '$lib/features/action-toast/useActionToast.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { m } from '$lib/features/i18n/messages.ts';
import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useIsQueued } from '$lib/features/offline/useIsQueued.ts';
import { whenExecuted } from '$lib/features/offline/whenExecuted.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { manageListsDrawerStore } from '$lib/sections/components/lists-drawer/manageListsDrawerStore.ts';
import { toBulkPayload } from '$lib/sections/media-actions/_internal/toBulkPayload.ts';
import { useIsWatchlisted } from '$lib/stores/useIsWatchlisted.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';
// The "change list" drawer needs a full entry; bulk mutations may only carry
// an `{ id }`.
function isListableEntry(item: { id: number }): item is MediaEntry {
  const candidate = item as Partial<MediaEntry>;

  return (candidate.type === 'movie' || candidate.type === 'show') &&
    typeof candidate.slug === 'string' &&
    typeof candidate.title === 'string';
}

type UseWatchlistProps = MediaStoreProps & {
  isToastEnabled?: boolean;
};

export function useWatchlist(props: UseWatchlistProps) {
  const { type, isToastEnabled = true } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { track } = useTrack(AnalyticsEvent.Watchlist);
  const notify = toGatedNotify(useActionToast().notify, isToastEnabled);

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

  const watchlistInvalidations = type === 'episode'
    ? []
    : [InvalidateAction.Watchlisted(type)];

  const addition = useMutation(defineMutation({
    key: 'watchlist:add',
    request: () =>
      executeOrEnqueue({
        endpoint: 'watchlist:add',
        keys: ids.map((id) => toMediaKey(type, id)),
        body,
        invalidations: watchlistInvalidations,
      }),
    invalidations: whenExecuted(watchlistInvalidations),
  }));

  const removal = useMutation(defineMutation({
    key: 'watchlist:remove',
    request: () =>
      executeOrEnqueue({
        endpoint: 'watchlist:remove',
        keys: ids.map((id) => toMediaKey(type, id)),
        body,
        invalidations: watchlistInvalidations,
      }),
    invalidations: whenExecuted(watchlistInvalidations),
  }));

  const isWatchlistUpdating = anyTrue([addition.isPending, removal.isPending]);

  const addToWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    track({ action: 'add' });

    await addition.mutate();

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
  };

  const removeFromWatchlist = async () => {
    if (type === 'episode') {
      return;
    }

    track({ action: 'remove' });

    await removal.mutate();

    notify({
      message: singleEntry
        ? m.action_toast_removed_from_watchlist({ title: singleEntry.title })
        : m.action_toast_removed_from_watchlist_generic(),
      action: undoToastAction(addToWatchlist),
    });
  };

  return {
    isWatchlistUpdating,
    isWatchlisted,
    isQueued,
    addToWatchlist,
    removeFromWatchlist,
  };
}
