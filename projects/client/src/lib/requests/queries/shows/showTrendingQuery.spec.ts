import { ShowsTrendingMappedMock } from '$mocks/data/shows/mapped/ShowsTrendingMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showTrendingQuery } from './showTrendingQuery.ts';

describe('showTrendingQuery', () => {
  it('should query for trending shows', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showTrendingQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowsTrendingMappedMock);
  });
});
