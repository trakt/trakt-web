import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { useConfirm } from '$lib/features/confirmation/useConfirm.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { removeWatchedRequest } from '$lib/requests/sync/removeWatchedRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { writable } from 'svelte/store';

export type UseRemoveFromHistoryProps = {
  id: number;
  type: 'movie' | 'episode';
  title: string;
};

export function useRemoveFromHistory(
  { id, type, title }: UseRemoveFromHistoryProps,
) {
  const isRemoving = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.RemoveFromHistory);
  const { confirm } = useConfirm();

  const removeFromHistory = async () => {
    isRemoving.set(true);
    track();

    await removeWatchedRequest({ body: { ids: [id] } });
    await invalidate(InvalidateAction.MarkAsWatched(type));

    isRemoving.set(false);
  };

  return {
    isRemoving,
    removeFromHistory: confirm({
      type: ConfirmationType.RemoveFromHistory,
      title,
      onConfirm: removeFromHistory,
    }),
  };
}
