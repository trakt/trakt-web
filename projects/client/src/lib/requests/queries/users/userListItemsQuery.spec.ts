import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { userListItemsQuery } from './userListItemsQuery.ts';

describe('userListItemsQuery', () => {
  it('should query list items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          userListItemsQuery({
            userId: UserProfileHarryMappedMock.slug,
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal([
      ...ListedShowsMappedMock,
      ...ListedMoviesMappedMock,
    ]);
  });

  it('should query show list items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          userListItemsQuery({
            userId: UserProfileHarryMappedMock.slug,
            listId: assertDefined(SiloListsMappedMock.at(0)).slug,
            type: 'show',
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ListedShowsMappedMock);
  });

  it('should query movie list items', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          userListItemsQuery({
            userId: UserProfileHarryMappedMock.slug,
            listId: assertDefined(HereticListsMappedMock.at(0)).slug,
            type: 'movie',
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ListedMoviesMappedMock);
  });
});
