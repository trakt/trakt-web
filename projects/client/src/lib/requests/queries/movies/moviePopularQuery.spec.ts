import { MoviesPopularMappedMock } from '$mocks/data/movies/mapped/MoviesPopularMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { moviePopularQuery } from './moviePopularQuery.ts';

describe('moviePopularQuery', () => {
  it('should query for popular movies', async () => {
    const result = await runQuery({
      factory: () => createQuery(moviePopularQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MoviesPopularMappedMock);
  });
});
