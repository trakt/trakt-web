import { MovieHereticCommentsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticCommentsMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieCommentsQuery } from './movieCommentsQuery.ts';

describe('movieCommentsQuery', () => {
  it('should query for comments on a movie', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieCommentsQuery({
            slug: MovieHereticMappedMock.slug,
            limit: 10,
            sort: 'likes',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticCommentsMappedMock);
  });
});
