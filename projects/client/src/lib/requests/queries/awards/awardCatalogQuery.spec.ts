import { AwardCatalogMappedMock } from '$mocks/data/awards/mapped/AwardCatalogMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { awardCatalogQuery } from './awardCatalogQuery.ts';

describe('awardCatalogQuery', () => {
  it('should query for the award catalog', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(awardCatalogQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(AwardCatalogMappedMock);
  });
});
