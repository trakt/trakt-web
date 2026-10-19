import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { readMediaSyncError } from './_internal/readMediaSyncError.ts';
import {
  mapToMediaSyncConnection,
  MediaSyncConnectionResponseSchema,
} from './mediaSyncConnectionsQuery.ts';
import type { MediaSyncConnection } from './models/MediaSyncConnection.ts';
import type { MediaSyncFeed } from './models/MediaSyncFeed.ts';
import type { MediaSyncResult } from './models/MediaSyncResult.ts';

type CreatePlexConnection = {
  provider?: 'plex';
  attemptId: string;
  serverId: string;
  libraryIds: string[];
  feeds: MediaSyncFeed[];
  syncAccountId: string | null;
  importHistory: boolean;
  webhookOnly: boolean;
};

type CreateJellyfinConnection = {
  provider: 'jellyfin';
  attemptId: string;
  libraryIds: string[];
  feeds: MediaSyncFeed[];
  importHistory: boolean;
};

type CreateMediaSyncConnectionParams = (
  | CreatePlexConnection
  | CreateJellyfinConnection
) &
  ApiParams;

function toBody(connection: CreatePlexConnection | CreateJellyfinConnection) {
  if (connection.provider === 'jellyfin') {
    return {
      provider: 'jellyfin',
      attempt_id: connection.attemptId,
      library_ids: connection.libraryIds,
      feeds: connection.feeds,
      import_history: connection.importHistory,
    };
  }

  return {
    provider: 'plex',
    attempt_id: connection.attemptId,
    server_id: connection.serverId,
    library_ids: connection.libraryIds,
    feeds: connection.feeds,
    sync_account_id: connection.syncAccountId ?? undefined,
    import_history: connection.importHistory,
    webhook_only: connection.webhookOnly || undefined,
  };
}

export async function createMediaSyncConnectionRequest({
  fetch,
  ...connection
}: CreateMediaSyncConnectionParams): Promise<
  MediaSyncResult<MediaSyncConnection>
> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/sync/connections',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toBody(connection)),
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
