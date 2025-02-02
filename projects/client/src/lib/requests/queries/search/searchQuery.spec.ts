import { SearchHereticMappedMock } from '$mocks/data/search/mapped/SearchHereticMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { searchQuery } from './searchQuery.ts';

describe('searchQuery', () => {
  // TODO figure out abortsignal issue
  it.skip('should query for searched items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          searchQuery({ query: MovieHereticResponseMock.title }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SearchHereticMappedMock);
  });
});
