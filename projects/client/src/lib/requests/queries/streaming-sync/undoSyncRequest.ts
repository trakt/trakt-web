import { api, type ApiParams } from '$lib/requests/api.ts';

type UndoSyncParams = {
  syncId: number;
} & ApiParams;

/**
 * Undoes a data sync, reversing every item it imported and marking it undone.
 */
export function undoSyncRequest(
  { fetch, syncId }: UndoSyncParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .syncs
    .undo({
      params: { id: syncId },
    })
    .then(({ status }) => status === 204);
}
