import { OfficialListsMappedMock } from '$mocks/data/lists/mapped/OfficialListsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { SiloListsMappedMock } from '../../../../mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { showListsQuery } from './showListsQuery.ts';

describe('showListsQuery', () => {
  it('should query for lists that contain Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showListsQuery({ slug: ShowSiloMappedMock.slug, limit: 10 }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SiloListsMappedMock);
  });

  it('should query for official lists that contain Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showListsQuery({
            slug: ShowSiloMappedMock.slug,
            limit: 10,
            type: 'official',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(OfficialListsMappedMock);
  });
});
