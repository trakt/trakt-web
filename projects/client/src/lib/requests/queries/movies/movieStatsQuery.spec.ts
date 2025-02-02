import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticStatsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStatsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieStatsQuery } from './movieStatsQuery.ts';

describe('movieStatsQuery', () => {
  it('should query stats for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(movieStatsQuery({ slug: MovieHereticMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticStatsMappedMock);
  });
});
