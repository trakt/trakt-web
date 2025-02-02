import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticRatingsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticRatingsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieRatingQuery } from './movieRatingQuery.ts';

describe('movieRatingQuery', () => {
  it('should query ratings for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(movieRatingQuery({ slug: MovieHereticMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticRatingsMappedMock);
  });
});
