import { WatchlistShowsMappedMock } from '$mocks/data/users/mapped/WatchlistShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showWatchlistQuery } from './showWatchlistQuery.ts';

describe('showWatchlistQuery', () => {
  it('should query watchlist shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showWatchlistQuery(),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(WatchlistShowsMappedMock);
  });
});
