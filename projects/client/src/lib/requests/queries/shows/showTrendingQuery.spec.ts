import { ShowsTrendingMappedMock } from '$mocks/data/shows/mapped/ShowsTrendingMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showTrendingQuery } from './showTrendingQuery.ts';

describe('showTrendingQuery', () => {
  it('should query for trending shows', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          showTrendingQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowsTrendingMappedMock);
  });
});
