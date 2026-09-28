import { WatchlistMoviesResponseMock } from '$mocks/data/users/response/WatchlistMoviesResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { watchlistQuery } from './watchlistQuery.ts';

function captureWatchlistUrl() {
  const captured: { url?: URL } = {};

  server.use(
    http.get('http://localhost/users/me/watchlist/movies*', ({ request }) => {
      captured.url = new URL(request.url);
      return HttpResponse.json(WatchlistMoviesResponseMock);
    }),
  );

  return captured;
}

function runWatchlist(terms?: string) {
  return runQuery({
    factory: () =>
      createTestBedInfiniteQuery(
        watchlistQuery({
          type: 'movie',
          sortBy: 'added',
          limit: 10,
          terms,
        }),
      ),
    mapper: mapToEntries,
  });
}

describe('watchlistQuery', () => {
  it('should send the search terms', async () => {
    const captured = captureWatchlistUrl();

    await runWatchlist('heretic');

    expect(captured.url?.searchParams.get('terms')).to.equal('heretic');
  });

  it('should leave the search terms out when there are none', async () => {
    const captured = captureWatchlistUrl();

    await runWatchlist();

    expect(captured.url?.searchParams.has('terms')).to.equal(false);
  });

  it('should key the cache on the search terms', () => {
    const params = {
      type: 'movie' as const,
      sortBy: 'added' as const,
      limit: 10,
    };

    expect(watchlistQuery({ ...params, terms: 'heretic' }).queryKey)
      .not.to.deep.equal(watchlistQuery(params).queryKey);
  });
});
