import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import z from 'zod';
import { InvalidateAction } from '../models/InvalidateAction.ts';
import {
  type MediaSyncConnection,
  MediaSyncConnectionSchema,
} from './models/MediaSyncConnection.ts';
import { MediaSyncFeedSchema } from './models/MediaSyncFeed.ts';

export const MediaSyncConnectionResponseSchema = z.object({
  id: z.number(),
  provider: z.enum(['plex', 'jellyfin']),
  status: z.enum([
    'active',
    'paused',
    'unreachable',
    'unauthorized',
    'disconnected',
  ]),
  server_id: z.string(),
  server_name: z.string().nullable(),
  account_name: z.string().nullable(),
  feeds: z.array(MediaSyncFeedSchema),
  libraries: z.array(z.object({
    id: z.number(),
    external_id: z.string(),
    kind: z.enum(['movies', 'shows']),
    title: z.string(),
    enabled: z.boolean(),
    item_count: z.number().nullable(),
  })),
  failure_count: z.number(),
  last_failure_kind: z.string().nullable(),
  collection_limit_reached: z.boolean(),
  last_synced_at: z.string().nullable(),
  next_sync_at: z.string(),
});

type MediaSyncConnectionResponse = z.infer<
  typeof MediaSyncConnectionResponseSchema
>;

export function mapToMediaSyncConnection(
  connection: MediaSyncConnectionResponse,
): MediaSyncConnection {
  return {
    id: connection.id,
    provider: connection.provider,
    status: connection.status,
    serverId: connection.server_id,
    serverName: connection.server_name,
    accountName: connection.account_name,
    feeds: connection.feeds,
    libraries: connection.libraries.map((library) => ({
      id: library.id,
      externalId: library.external_id,
      kind: library.kind,
      title: library.title,
      enabled: library.enabled,
      itemCount: library.item_count,
    })),
    failureCount: connection.failure_count,
    lastFailureKind: connection.last_failure_kind,
    collectionLimitReached: connection.collection_limit_reached,
    lastSyncedAt: connection.last_synced_at == null
      ? null
      : new Date(connection.last_synced_at),
    nextSyncAt: new Date(connection.next_sync_at),
  };
}

const mediaSyncConnectionsRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/sync/connections',
  });
  if (!response.ok) {
    throw new Error(
      `Failed to load media server connections: ${response.status}`,
    );
  }
  return {
    body: z.array(MediaSyncConnectionResponseSchema).parse(
      await response.json(),
    ),
    status: 200,
  };
};

export const mediaSyncConnectionsQuery = defineQuery({
  key: 'mediaSyncConnections',
  invalidations: [InvalidateAction.MediaSync.Connections],
  dependencies: [],
  request: mediaSyncConnectionsRequest,
  mapper: (response) => response.body.map(mapToMediaSyncConnection),
  schema: z.array(MediaSyncConnectionSchema),
  ttl: time.minutes(1),
});
