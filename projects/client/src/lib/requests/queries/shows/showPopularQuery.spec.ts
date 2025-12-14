import { ShowsPopularMappedMock } from '$mocks/data/shows/mapped/ShowsPopularMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showPopularQuery } from './showPopularQuery.ts';

describe('showPopularQuery', () => {
  it('should query for popular shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(showPopularQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowsPopularMappedMock);
  });
});
