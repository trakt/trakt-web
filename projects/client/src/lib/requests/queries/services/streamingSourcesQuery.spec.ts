import { StreamingSourcesMappedMock } from '$mocks/data/watchnow/mapped/StreamingSourcesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { streamingSourcesQuery } from './streamingSourcesQuery.ts';

describe('streamingSourcesQuery', () => {
  it('should query all streaming sources', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          streamingSourcesQuery({}),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(StreamingSourcesMappedMock);
  });
});
