import { MediaSyncRunsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncRunsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { mediaSyncRunsQuery } from './mediaSyncRunsQuery.ts';

describe('mediaSyncRunsQuery', () => {
  it('maps the runs of a connection', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(mediaSyncRunsQuery({ connectionId: 7 })),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(MediaSyncRunsMappedMock);
  });
});
