import { MoviesTrendingMappedMock } from '$mocks/data/movies/mapped/MoviesTrendingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieTrendingQuery } from './movieTrendingQuery.ts';

describe('movieTrendingQuery', () => {
  it('should query trending movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieTrendingQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MoviesTrendingMappedMock);
  });
});
