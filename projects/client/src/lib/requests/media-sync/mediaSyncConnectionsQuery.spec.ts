import { MediaSyncConnectionsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncConnectionsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { mediaSyncConnectionsQuery } from './mediaSyncConnectionsQuery.ts';

describe('mediaSyncConnectionsQuery', () => {
  it('maps the connections, their libraries and feeds', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(mediaSyncConnectionsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(MediaSyncConnectionsMappedMock);
  });
});
