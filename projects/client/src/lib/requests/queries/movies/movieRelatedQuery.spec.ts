import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticRelatedMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticRelatedMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieRelatedQuery } from './movieRelatedQuery.ts';

const PAGINATION_PARAMS = {
  limit: DEFAULT_PAGE_SIZE,
};

describe('movieRelatedQuery', () => {
  it('should query related for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          movieRelatedQuery({
            slug: MovieHereticMappedMock.slug,
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(MovieHereticRelatedMappedMock);
  });
});
