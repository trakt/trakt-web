import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { HereticListsMappedMock } from '../../../../mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { movieListsQuery } from './movieListsQuery.ts';

describe('movieListsQuery', () => {
  it('should query for lists that contain Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieListsQuery({ slug: MovieHereticMappedMock.slug, limit: 10 }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(HereticListsMappedMock);
  });
});
