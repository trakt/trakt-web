import { time } from '$lib/utils/timing/time.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { MovieActivityHistoryMappedMock } from '../../../../mocks/data/users/mapped/MovieActivityHistoryMappedMock.ts';
import { movieActivityHistoryQuery } from './movieActivityHistoryQuery.ts';

describe('movieActivityHistoryQuery', () => {
  it('should query watched movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          movieActivityHistoryQuery({
            slug: 'me',
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MovieActivityHistoryMappedMock);
  });
});
