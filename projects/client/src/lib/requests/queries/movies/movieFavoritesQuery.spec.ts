import { FavoritedMoviesMappedMock } from '$mocks/data/users/mapped/FavoritedMoviesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieFavoritesQuery } from './movieFavoritesQuery.ts';

describe('movieFavoritesQuery', () => {
  it('should query for favorited movies', async () => {
    const result = await runQuery({
      factory: () => createQuery(movieFavoritesQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(FavoritedMoviesMappedMock);
  });
});
