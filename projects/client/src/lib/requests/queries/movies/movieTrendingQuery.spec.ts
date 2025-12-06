import { MoviesTrendingMappedMock } from '$mocks/data/movies/mapped/MoviesTrendingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieTrendingQuery } from './movieTrendingQuery.ts';

describe('movieTrendingQuery', () => {
  it('should query trending movies', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          movieTrendingQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MoviesTrendingMappedMock);
  });
});
