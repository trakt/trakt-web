import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { WatchlistMoviesMappedMock } from '$mocks/data/users/mapped/WatchlistMoviesMappedMock.ts';
import { WatchlistShowsMappedMock } from '$mocks/data/users/mapped/WatchlistShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { watchlistQuery } from './watchlistQuery.ts';

const COMMON_PARAMS = {
  limit: 10,
  page: 1,
  sort: 'added',
};

describe('watchlistQuery', () => {
  it('should query watchlist movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          watchlistQuery({ type: 'movie', ...COMMON_PARAMS }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(WatchlistMoviesMappedMock);
  });

  it('should invalidate on watchlisted movie', async () => {
    const query = watchlistQuery({ type: 'movie', ...COMMON_PARAMS });

    await query.queryKey.includes(InvalidateAction.Watchlisted('movie'));
  });

  it('should invalidate on mark as watched', async () => {
    const query = watchlistQuery({ type: 'movie', ...COMMON_PARAMS });

    await query.queryKey.includes(InvalidateAction.MarkAsWatched('movie'));
  });

  it('should query watchlist shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          watchlistQuery({ type: 'show', ...COMMON_PARAMS }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(WatchlistShowsMappedMock);
  });
});
