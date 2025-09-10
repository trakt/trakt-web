import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { deleteCheckinRequest } from '$lib/requests/queries/checkin/deleteCheckinRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { derived, writable } from 'svelte/store';

export function useStopNowPlaying(nowPlaying: NowPlayingItem) {
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.CheckIn);

  const isStopping = writable(false);
  const isStoppable = nowPlaying.action === 'checkin';

  const deleteCheckin = async () => {
    if (!isStoppable) {
      return;
    }

    isStopping.set(true);

    track({ type: nowPlaying.type, action: 'stop' });
    await deleteCheckinRequest({});
    await invalidate(InvalidateAction.CheckIn);

    isStopping.set(false);
  };

  return {
    isStopping: derived(isStopping, ($isStopping) => $isStopping),
    stop: deleteCheckin,
    isStoppable,
  };
}
