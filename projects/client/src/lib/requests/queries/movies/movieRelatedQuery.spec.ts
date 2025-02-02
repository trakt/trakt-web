import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticRelatedMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticRelatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieRelatedQuery } from './movieRelatedQuery.ts';

describe('movieRelatedQuery', () => {
  it('should query related for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(movieRelatedQuery({ slug: MovieHereticMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticRelatedMappedMock);
  });
});
