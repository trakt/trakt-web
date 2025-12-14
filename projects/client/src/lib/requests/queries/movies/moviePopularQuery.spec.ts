import { MoviesPopularMappedMock } from '$mocks/data/movies/mapped/MoviesPopularMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { moviePopularQuery } from './moviePopularQuery.ts';

describe('moviePopularQuery', () => {
  it('should query for popular movies', async () => {
    const result = await runQuery({
      factory: () => createTestBedInfiniteQuery(moviePopularQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MoviesPopularMappedMock);
  });
});
