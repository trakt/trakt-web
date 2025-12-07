import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { userListItemsQuery } from './userListItemsQuery.ts';

const PAGINATION_PARAMS = {
  limit: DEFAULT_PAGE_SIZE,
};

describe('userListItemsQuery', () => {
  it('should query list items', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          userListItemsQuery({
            userId: assertDefined(UserProfileHarryMappedMock.slug),
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal([
      ...ListedShowsMappedMock,
      ...ListedMoviesMappedMock,
    ]);
  });

  it('should query show list items', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          userListItemsQuery({
            userId: assertDefined(UserProfileHarryMappedMock.slug),
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
            type: 'show',
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ListedShowsMappedMock);
  });

  it('should query movie list items', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          userListItemsQuery({
            userId: assertDefined(UserProfileHarryMappedMock.slug),
            listId: assertDefined(HereticListsMappedMock.at(0)).slug,
            type: 'movie',
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ListedMoviesMappedMock);
  });
});
