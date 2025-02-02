import { ShowsTrendingMappedMock } from '$mocks/data/shows/mapped/ShowsTrendingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showTrendingQuery } from './showTrendingQuery.ts';

describe('showTrendingQuery', () => {
  it('should query for trending shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showTrendingQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowsTrendingMappedMock);
  });
});
