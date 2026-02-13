import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticSentimentMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticSentimentMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieSentimentQuery } from './movieSentimentQuery.ts';

describe('movieSentimentQuery', () => {
  it('should query for movie sentiment', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieSentimentQuery({ slug: MovieHereticMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticSentimentMappedMock);
  });
});
