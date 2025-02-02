import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticPeopleMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticPeopleMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { moviePeopleQuery } from './moviePeopleQuery.ts';

describe('moviePeopleQuery', () => {
  it('should query people for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(moviePeopleQuery({ slug: MovieHereticMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieHereticPeopleMappedMock);
  });
});
