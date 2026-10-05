import { MediaSyncAccountsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncAccountsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { mediaSyncAccountsQuery } from './mediaSyncAccountsQuery.ts';

describe('mediaSyncAccountsQuery', () => {
  it('maps the Plex profiles with their avatars', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(mediaSyncAccountsQuery({ connectionId: 7 })),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(MediaSyncAccountsMappedMock);
  });
});
