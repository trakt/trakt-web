import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { offlineActionsStore } from './_internal/offlineActionsStore.ts';
import { executeOrEnqueue } from './executeOrEnqueue.ts';

const WATCHLIST_BODY = { movies: [{ ids: { trakt: 1 } }] };

function addToWatchlist() {
  return executeOrEnqueue({
    endpoint: 'watchlist:add',
    keys: ['movie:1'],
    body: WATCHLIST_BODY,
    invalidations: ['invalidate:watchlisted:movie'],
  });
}

async function drainQueue() {
  const ids = offlineActionsStore.current().map(({ id }) => id);
  await offlineActionsStore.remove(ids);
}

describe('util: executeOrEnqueue', () => {
  it('should execute right away when the request succeeds', async () => {
    const result = await addToWatchlist();

    expect(result).toBe('executed');
    expect(offlineActionsStore.current()).toEqual([]);
  });

  it('should treat an http error as executed (server rejected)', async () => {
    server.use(
      http.post(
        'http://localhost/sync/watchlist',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const result = await addToWatchlist();

    expect(result).toBe('executed');
    expect(offlineActionsStore.current()).toEqual([]);
  });

  it('should queue the action when the network is unreachable', async () => {
    server.use(
      http.post(
        'http://localhost/sync/watchlist',
        () => HttpResponse.error(),
      ),
    );

    const result = await addToWatchlist();

    expect(result).toBe('queued');
    expect(offlineActionsStore.current()).toMatchObject([
      {
        endpoint: 'watchlist:add',
        keys: ['movie:1'],
        body: WATCHLIST_BODY,
      },
    ]);

    await drainQueue();
  });
});
