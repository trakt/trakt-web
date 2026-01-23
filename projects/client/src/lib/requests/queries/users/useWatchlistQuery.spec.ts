import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { WatchlistMoviesMappedMock } from '$mocks/data/users/mapped/WatchlistMoviesMappedMock.ts';
import { WatchlistShowsMappedMock } from '$mocks/data/users/mapped/WatchlistShowsMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { watchlistQuery } from './watchlistQuery.ts';

const COMMON_PARAMS = {
  limit: 10,
  sortBy: 'added' as const,
};

describe('watchlistQuery', () => {
  it('should query watchlist movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          watchlistQuery({ type: 'movie', ...COMMON_PARAMS }),
        ),
      mapper: mapToEntries,
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
        createTestBedInfiniteQuery(
          watchlistQuery({ type: 'show', ...COMMON_PARAMS }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(WatchlistShowsMappedMock);
  });
});
