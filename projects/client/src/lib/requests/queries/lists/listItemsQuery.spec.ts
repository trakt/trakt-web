import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { listItemsQuery } from './listItemsQuery.ts';

const PAGINATION_PARAMS = {
  limit: 10,
};

describe('listItemsQuery', () => {
  it('should query list items', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          listItemsQuery({
            listId: `${assertDefined(SiloListsMappedMock.at(0)).id}`,
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
          listItemsQuery({
            listId: `${assertDefined(SiloListsMappedMock.at(0)).id}`,
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
          listItemsQuery({
            listId: `${assertDefined(HereticListsMappedMock.at(0)).id}`,
            type: 'movie',
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ListedMoviesMappedMock);
  });
});
