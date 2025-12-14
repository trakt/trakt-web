import { RecommendedMoviesMappedMock } from '$mocks/data/recommendations/mapped/RecommendedMoviesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { recommendedMoviesQuery } from './recommendedMoviesQuery.ts';

describe('recommendedMoviesQuery', () => {
  it('should query recommended movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          recommendedMoviesQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(RecommendedMoviesMappedMock);
  });
});
