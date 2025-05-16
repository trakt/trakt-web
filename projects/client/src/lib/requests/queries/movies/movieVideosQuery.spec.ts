import { MovieHereticVideoMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticVideoMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieVideosQuery } from './movieVideosQuery.ts';

describe('movieVideosQuery', () => {
  it('should query videos for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieVideosQuery({ slug: MovieHereticResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.have.deep.members(MovieHereticVideoMappedMock);
  });
});
