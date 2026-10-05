import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { resyncMediaSyncConnectionRequest } from '$lib/requests/media-sync/resyncMediaSyncConnectionRequest.ts';
import { retryMediaSyncConnectionRequest } from '$lib/requests/media-sync/retryMediaSyncConnectionRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { combineLatest, map } from 'rxjs';

export function useServerActions(connectionId: number) {
  const invalidations = [
    InvalidateAction.MediaSync.Connections,
    InvalidateAction.MediaSync.Runs,
  ];

  const resync = useMutation(defineMutation({
    key: 'media-sync:resync-connection',
    request: () => resyncMediaSyncConnectionRequest({ connectionId }),
    invalidations,
  }));

  const retry = useMutation(defineMutation({
    key: 'media-sync:retry-connection',
    request: () => retryMediaSyncConnectionRequest({ connectionId }),
    invalidations,
  }));

  return {
    syncNow: () => resync.mutate(),
    retry: () => retry.mutate(),
    isBusy: combineLatest([resync.isPending, retry.isPending]).pipe(
      map((pending) => pending.some(Boolean)),
    ),
  };
}
