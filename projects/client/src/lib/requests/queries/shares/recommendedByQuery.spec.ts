import { RecommendedByMappedMock } from '$mocks/data/shares/mapped/RecommendedByMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { recommendedByQuery } from './recommendedByQuery.ts';

describe('recommendedByQuery', () => {
  it('should map the sharers and the remaining count', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          recommendedByQuery({ url: '/movies/pressure-2026' }),
        ),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(RecommendedByMappedMock);
  });
});
