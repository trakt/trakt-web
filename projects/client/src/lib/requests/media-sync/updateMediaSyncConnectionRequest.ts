import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { readMediaSyncError } from './_internal/readMediaSyncError.ts';
import type { MediaSyncFeed } from './models/MediaSyncFeed.ts';
import type { MediaSyncResult } from './models/MediaSyncResult.ts';

export type MediaSyncConnectionChanges = {
  feeds?: MediaSyncFeed[];
  enabledLibraryIds?: number[];
  paused?: boolean;
  syncAccountId?: string;
};

export async function updateMediaSyncConnectionRequest(
  { fetch, connectionId, changes }:
    & { connectionId: number; changes: MediaSyncConnectionChanges }
    & ApiParams,
): Promise<MediaSyncResult<null>> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/connections/${connectionId}`,
    init: {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feeds: changes.feeds,
        enabled_library_ids: changes.enabledLibraryIds,
        paused: changes.paused,
        sync_account_id: changes.syncAccountId,
      }),
    },
  });
  return response.ok
    ? { ok: true, value: null }
    : { ok: false, error: await readMediaSyncError(response) };
}
