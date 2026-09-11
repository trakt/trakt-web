import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { deleteCheckinRequest } from '$lib/requests/queries/checkin/deleteCheckinRequest.ts';

export function useStopNowPlaying(nowPlaying: NowPlayingItem) {
  const { track } = useTrack(AnalyticsEvent.CheckIn);

  const isStoppable = nowPlaying.action === 'checkin';

  const stopping = useMutation(defineMutation({
    key: 'check-in:stop',
    request: () => deleteCheckinRequest({}),
    invalidations: [InvalidateAction.CheckIn],
  }));

  const deleteCheckin = async () => {
    if (!isStoppable) {
      return;
    }

    track({ type: nowPlaying.type, action: 'stop' });

    await stopping.mutate();
  };

  return {
    isStopping: stopping.isPending,
    stop: deleteCheckin,
    isStoppable,
  };
}
