import { FavoritedMoviesMappedMock } from '$mocks/data/users/mapped/FavoritedMoviesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieFavoritesQuery } from './movieFavoritesQuery.ts';

describe('movieFavoritesQuery', () => {
  it('should query for favorited movies', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(movieFavoritesQuery({ slug: 'me' })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FavoritedMoviesMappedMock);
  });
});
