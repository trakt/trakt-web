import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showSeasonsQuery } from './showSeasonsQuery.ts';

describe('showSeasonsQuery', () => {
  it('should query seasons for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showSeasonsQuery({ slug: ShowSiloMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSeasonsMappedMock);
  });
});
