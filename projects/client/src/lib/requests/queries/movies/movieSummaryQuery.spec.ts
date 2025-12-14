import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieSummaryQuery } from './movieSummaryQuery.ts';

describe('movieSummaryQuery', () => {
  it('should query for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieSummaryQuery({ slug: MovieHereticMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticMappedMock);
  });
});
