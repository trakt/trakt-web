import { MediaSyncConnectionsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncConnectionsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { MediaSyncConnectionsResponseMock } from '$mocks/data/media-sync/response/MediaSyncConnectionsResponseMock.ts';
import {
  MediaSyncConnectionResponseSchema,
  mapToMediaSyncConnection,
  mediaSyncConnectionsQuery,
} from './mediaSyncConnectionsQuery.ts';

describe('mediaSyncConnectionsQuery', () => {
  it('maps the connections, their libraries and feeds', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(mediaSyncConnectionsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(MediaSyncConnectionsMappedMock);
  });

  it('keeps a valid webhook refusal and event time', () => {
    const [, jellyfin] = MediaSyncConnectionsResponseMock;
    const connection = mapToMediaSyncConnection(
      MediaSyncConnectionResponseSchema.parse({
        ...jellyfin,
        webhook_refusal: 'not_vip',
      }),
    );

    expect(connection.webhookRefusal).toBe('not_vip');
    expect(connection.webhookSeenAt).toEqual(
      new Date('2026-10-05T09:30:00.000Z'),
    );
  });

  it('tolerates an unknown webhook refusal', () => {
    const [, jellyfin] = MediaSyncConnectionsResponseMock;
    const parsed = MediaSyncConnectionResponseSchema.parse({
      ...jellyfin,
      webhook_refusal: 'something_new',
    });

    expect(parsed.webhook_refusal).toBeUndefined();
    expect(mapToMediaSyncConnection(parsed).webhookRefusal).toBeNull();
  });

  it('drops a malformed webhook event time', () => {
    const [, jellyfin] = MediaSyncConnectionsResponseMock;
    const connection = mapToMediaSyncConnection(
      MediaSyncConnectionResponseSchema.parse({
        ...jellyfin,
        webhook_seen_at: 'unknown',
      }),
    );

    expect(connection.webhookSeenAt).toBeNull();
  });

  it('tolerates missing webhook fields', () => {
    const [, jellyfin] = MediaSyncConnectionsResponseMock;
    const connection = mapToMediaSyncConnection(
      MediaSyncConnectionResponseSchema.parse({
        ...jellyfin!,
        webhook_seen_at: undefined,
        webhook_refusal: undefined,
      }),
    );

    expect(connection.webhookSeenAt).toBeNull();
    expect(connection.webhookRefusal).toBeNull();
  });
});
