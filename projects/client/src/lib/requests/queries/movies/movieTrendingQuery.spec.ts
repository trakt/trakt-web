import { MoviesTrendingMappedMock } from '$mocks/data/movies/mapped/MoviesTrendingMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { movieTrendingQuery } from './movieTrendingQuery.ts';

describe('movieTrendingQuery', () => {
  it('should query trending movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          movieTrendingQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MoviesTrendingMappedMock);
  });
});
