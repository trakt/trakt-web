import { WatchedShowsMappedMock } from '$mocks/data/users/mapped/WatchedShowsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { currentUserWatchedShowsQuery } from './currentUserWatchedShowsQuery.ts';

describe('currentUserWatchedShowsQuery', () => {
  it('should query for watched shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(currentUserWatchedShowsQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(WatchedShowsMappedMock);
  });
});
