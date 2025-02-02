import { RecommendedShowsMappedMock } from '$mocks/data/recommendations/mapped/RecommendedShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { recommendedShowsQuery } from './recommendedShowsQuery.ts';

describe('recommendedShowsQuery', () => {
  it('should query recommended shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          recommendedShowsQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(RecommendedShowsMappedMock);
  });
});
