import { SearchMediaMappedMock } from '$mocks/data/search/mapped/SearchMediaMappedMock.ts';
import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { DEFAULT_SEARCH_LIMIT } from '../../../utils/constants.ts';
import { searchMediaQuery } from './searchMediaQuery.ts';

describe('searchMediaQuery', () => {
  // TODO figure out abortsignal issue
  it.skip('should query for searched items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          searchMediaQuery({
            query: MovieHereticResponseMock.title,
            limit: DEFAULT_SEARCH_LIMIT,
            config: {
              keys: {
                media: '',
                people: '',
              },
              server: '',
            },
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SearchMediaMappedMock);
  });
});
