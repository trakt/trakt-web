import { api, type ApiParams } from '$lib/requests/api.ts';

type PlexUndoSyncParams = {
  syncId: number;
} & ApiParams;

export function plexUndoSyncRequest(
  { syncId, fetch }: PlexUndoSyncParams,
): Promise<boolean> {
  return api({ fetch }).users.syncs.undo({
    params: { id: syncId },
  }).then(({ status }) => status === 204);
}
