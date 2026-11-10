import { ShowShogunAwardsMappedMock } from '$mocks/data/awards/mapped/ShowShogunAwardsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showAwardsQuery } from './showAwardsQuery.ts';

describe('showAwardsQuery', () => {
  it('should query awards for Shōgun (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(showAwardsQuery({ slug: 'shogun-2024' })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowShogunAwardsMappedMock);
  });
});
