import { RecommendedShowsMappedMock } from '$mocks/data/recommendations/mapped/RecommendedShowsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { recommendedShowsQuery } from './recommendedShowsQuery.ts';

describe('recommendedShowsQuery', () => {
  it('should query recommended shows', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          recommendedShowsQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(RecommendedShowsMappedMock);
  });
});
