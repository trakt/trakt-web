import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticStudiosMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticStudiosMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieStudiosQuery } from './movieStudiosQuery.ts';

describe('movieStudiosQuery', () => {
  it('should query studios for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(movieStudiosQuery({ slug: MovieHereticMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticStudiosMappedMock);
  });
});
