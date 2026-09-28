import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { server } from '$mocks/server.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { userListItemsQuery } from './userListItemsQuery.ts';

const PAGINATION_PARAMS = {
  limit: DEFAULT_PAGE_SIZE,
};

describe('userListItemsQuery', () => {
  it('should query list items', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
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
        createTestBedInfiniteQuery(
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
        createTestBedInfiniteQuery(
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

  it('should send the search terms', async () => {
    const userId = assertDefined(UserProfileHarryMappedMock.slug);
    const listId = assertDefined(SiloListsMappedMock.at(0)).slug;
    let requestedUrl: URL | undefined;

    server.use(
      http.get(
        `http://localhost/users/${userId}/lists/${listId}/items/*`,
        ({ request }) => {
          requestedUrl = new URL(request.url);
          return HttpResponse.json(ListedMoviesResponseMock);
        },
      ),
    );

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          userListItemsQuery({
            userId,
            listId,
            terms: 'silo',
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(requestedUrl?.searchParams.get('terms')).to.equal('silo');
  });

  it('should key the cache on the search terms', () => {
    const params = {
      userId: assertDefined(UserProfileHarryMappedMock.slug),
      listId: assertDefined(SiloListsMappedMock.at(0)).slug,
      ...PAGINATION_PARAMS,
    };

    expect(userListItemsQuery({ ...params, terms: 'silo' }).queryKey)
      .not.to.deep.equal(userListItemsQuery(params).queryKey);
  });
});
