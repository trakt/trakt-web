import { ShowsAnticipatedMappedMock } from '$mocks/data/shows/mapped/ShowsAnticipatedMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showAnticipatedQuery } from './showAnticipatedQuery.ts';

describe('showAnticipatedQuery', () => {
  it('should query for anticipated shows', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(showAnticipatedQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowsAnticipatedMappedMock);
  });
});
