import { OfficialListsMappedMock } from '$mocks/data/lists/mapped/OfficialListsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { SiloListsMappedMock } from '../../../../mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { showListsQuery } from './showListsQuery.ts';

describe('showListsQuery', () => {
  it('should query for lists that contain Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showListsQuery({ slug: ShowSiloMappedMock.slug, limit: 10 }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(SiloListsMappedMock);
  });

  it('should query for official lists that contain Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          showListsQuery({
            slug: ShowSiloMappedMock.slug,
            limit: 10,
            type: 'official',
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(OfficialListsMappedMock);
  });
});
