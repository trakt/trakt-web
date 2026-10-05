import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { deleteMediaSyncConnectionRequest } from '$lib/requests/media-sync/deleteMediaSyncConnectionRequest.ts';
import {
  type MediaSyncConnectionChanges,
  updateMediaSyncConnectionRequest,
} from '$lib/requests/media-sync/updateMediaSyncConnectionRequest.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { combineLatest, map } from 'rxjs';
import { useSyncAccounts } from './useSyncAccounts.ts';

export function useManageServer(connectionId: number) {
  const invalidations = [
    InvalidateAction.MediaSync.Connections,
    InvalidateAction.MediaSync.Runs,
  ];

  const accounts = useSyncAccounts(connectionId);

  const update = useMutation(defineMutation({
    key: 'media-sync:update-connection',
    request: (changes: MediaSyncConnectionChanges) =>
      updateMediaSyncConnectionRequest({ connectionId, changes }),
    invalidations,
  }));

  const remove = useMutation(defineMutation({
    key: 'media-sync:delete-connection',
    request: () => deleteMediaSyncConnectionRequest({ connectionId }),
    invalidations,
  }));

  return {
    accounts,
    save: (changes: MediaSyncConnectionChanges) =>
      update.mutate(changes)
        .then((result) => result.ok)
        .catch(() => false),
    remove: () => remove.mutate().catch(() => false),
    isBusy: combineLatest([update.isPending, remove.isPending]).pipe(
      map((pending) => pending.some(Boolean)),
    ),
  };
}
