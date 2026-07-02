import { WatchedMoviePlaysMappedMock } from '$mocks/data/users/mapped/WatchedMoviePlaysMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserWatchedMoviePlaysQuery } from './currentUserWatchedMoviePlaysQuery.ts';

describe('currentUserWatchedMoviePlaysQuery', () => {
  it('should map watched movie plays with ids sorted by most recent watch', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserWatchedMoviePlaysQuery({})),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(WatchedMoviePlaysMappedMock);
  });
});
