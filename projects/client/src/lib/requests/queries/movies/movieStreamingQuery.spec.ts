import { MoviesStreamingMappedMock } from '$mocks/data/movies/mapped/MoviesStreamingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieStreamingQuery } from './movieStreamingQuery.ts';

describe('movieStreamingQuery', () => {
  it('should query trending streaming movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieStreamingQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MoviesStreamingMappedMock);
  });
});
