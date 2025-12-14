import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloRelatedMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloRelatedMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { showRelatedQuery } from './showRelatedQuery.ts';

const PAGINATION_PARAMS = {
  limit: DEFAULT_PAGE_SIZE,
};

describe('showRelatedQuery', () => {
  it('should query related for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showRelatedQuery({
            slug: ShowSiloMappedMock.slug,
            ...PAGINATION_PARAMS,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowSiloRelatedMappedMock);
  });
});
