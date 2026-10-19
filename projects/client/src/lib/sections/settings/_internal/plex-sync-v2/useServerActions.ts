import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { resyncMediaSyncConnectionRequest } from '$lib/requests/media-sync/resyncMediaSyncConnectionRequest.ts';
import { retryMediaSyncConnectionRequest } from '$lib/requests/media-sync/retryMediaSyncConnectionRequest.ts';
import { syncNowMediaSyncConnectionRequest } from '$lib/requests/media-sync/syncNowMediaSyncConnectionRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';

export function useServerActions(connectionId: number) {
  const { track } = useTrack(AnalyticsEvent.PlexSync);

  const invalidations = [
    InvalidateAction.MediaSync.Connections,
    InvalidateAction.MediaSync.Runs,
  ];

  const syncSoon = useMutation(
    defineMutation({
      key: 'media-sync:sync-now-connection',
      request: () => syncNowMediaSyncConnectionRequest({ connectionId }),
      invalidations,
    }),
  );

  const resync = useMutation(
    defineMutation({
      key: 'media-sync:resync-connection',
      request: () => resyncMediaSyncConnectionRequest({ connectionId }),
      invalidations,
    }),
  );

  const retry = useMutation(
    defineMutation({
      key: 'media-sync:retry-connection',
      request: () => retryMediaSyncConnectionRequest({ connectionId }),
      invalidations,
    }),
  );

  return {
    syncNow: () => {
      track({ action: 'sync-now' });

      return syncSoon.mutate();
    },
    importPastWatches: () => resync.mutate(),
    retry: () => {
      track({ action: 'retry' });

      return retry.mutate();
    },
    isBusy: anyTrue([syncSoon.isPending, resync.isPending, retry.isPending]),
  };
}
