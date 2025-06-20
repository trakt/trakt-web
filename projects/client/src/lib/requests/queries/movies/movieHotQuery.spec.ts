import { MoviesHotMappedMock } from '$mocks/data/movies/mapped/MoviesHotMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieHotQuery } from './movieHotQuery.ts';

describe('movieHotQuery', () => {
  it('should query for hot movies', async () => {
    const result = await runQuery({
      factory: () => createQuery(movieHotQuery()),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MoviesHotMappedMock);
  });
});
