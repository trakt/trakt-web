import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticWatchedNowMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticWatchNowMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { streamMovieQuery } from './streamMovieQuery.ts';

describe('streamMovieQuery', () => {
  it('should query for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          streamMovieQuery({ id: MovieHereticMappedMock.slug, country: 'us' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticWatchedNowMappedMock);
  });
});
