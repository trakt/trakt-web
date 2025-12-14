import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { ShowSiloMappedMock } from '../../../../mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { showSummaryQuery } from './showSummaryQuery.ts';

describe('showSummaryQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(showSummaryQuery({ slug: ShowSiloMappedMock.slug })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloMappedMock);
  });
});
