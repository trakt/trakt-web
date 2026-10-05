import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { readMediaSyncError } from './_internal/readMediaSyncError.ts';
import {
  mapToMediaSyncConnection,
  MediaSyncConnectionResponseSchema,
} from './mediaSyncConnectionsQuery.ts';
import type { MediaSyncConnection } from './models/MediaSyncConnection.ts';
import type { MediaSyncFeed } from './models/MediaSyncFeed.ts';
import type { MediaSyncResult } from './models/MediaSyncResult.ts';

type CreatePlexConnectionParams = {
  attemptId: string;
  serverId: string;
  libraryIds: string[];
  feeds: MediaSyncFeed[];
  syncAccountId: string | null;
} & ApiParams;

export async function createMediaSyncConnectionRequest(
  { fetch, attemptId, serverId, libraryIds, feeds, syncAccountId }:
    CreatePlexConnectionParams,
): Promise<MediaSyncResult<MediaSyncConnection>> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/sync/connections',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'plex',
        attempt_id: attemptId,
        server_id: serverId,
        library_ids: libraryIds,
        feeds,
        sync_account_id: syncAccountId ?? undefined,
      }),
    },
  });
  if (!response.ok) {
    return { ok: false, error: await readMediaSyncError(response) };
  }
  return {
    ok: true,
    value: mapToMediaSyncConnection(
      MediaSyncConnectionResponseSchema.parse(await response.json()),
    ),
  };
}
