import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticWatchedNowMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticWatchNowMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieWatchNowQuery } from './movieWatchNowQuery.ts';

describe('movieWatchNowQuery', () => {
  it('should query for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieWatchNowQuery({ id: MovieHereticMappedMock.id, country: 'us' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticWatchedNowMappedMock);
  });
});
