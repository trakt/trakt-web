import { smartListQuery } from '$lib/requests/queries/users/smartListQuery.ts';
import { MovieSmartListMappedMock } from '$mocks/data/users/mapped/MovieSmartListMappedMock.ts';
import { ShowSmartListMappedMock } from '$mocks/data/users/mapped/ShowSmartListMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';

describe('smartListQuery', () => {
  it('should request movie smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          smartListQuery({
            type: 'movie',
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MovieSmartListMappedMock);
  });

  it('should request show smart lists', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          smartListQuery({
            type: 'show',
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowSmartListMappedMock);
  });
});
