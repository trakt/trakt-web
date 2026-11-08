import { RecommendedMoviesMappedMock } from '$mocks/data/recommendations/mapped/RecommendedMoviesMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { anticipatedRecommendedMoviesQuery } from './anticipatedRecommendedMoviesQuery.ts';

describe('anticipatedRecommendedMoviesQuery', () => {
  it('should query anticipated recommended movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(anticipatedRecommendedMoviesQuery()),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(
      RecommendedMoviesMappedMock.map((movie) =>
        Object.fromEntries(
          Object.entries(movie).filter(
            ([key]) => key !== 'sources' && key !== 'people',
          ),
        ),
      ),
    );
  });
});
