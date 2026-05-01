import { WatchedMoviesMappedMock } from '$mocks/data/users/mapped/WatchedMoviesMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { currentUserWatchedMoviesQuery } from './currentUserWatchedMoviesQuery.ts';

describe('currentUserWatchedMoviesQuery', () => {
  it('should query for watched movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(currentUserWatchedMoviesQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(WatchedMoviesMappedMock);
  });
});
