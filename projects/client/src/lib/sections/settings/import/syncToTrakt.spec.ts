import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UniversalImportItem } from './ImportTypes.ts';
import { syncToTrakt } from './syncToTrakt.ts';

const historyAdd = vi.fn();
const watchlistAdd = vi.fn();
const ratingsAdd = vi.fn();

vi.mock('$lib/requests/api.ts', () => ({
  api: () => ({
    sync: {
      history: { add: historyAdd },
      watchlist: { add: watchlistAdd },
      ratings: { add: ratingsAdd },
    },
  }),
}));

vi.mock('$lib/sections/settings/sync/retryWithRateLimit.ts', () => ({
  retryWithRateLimit: <T>(fn: () => Promise<T>) => fn(),
}));

vi.mock('./engine/matchMovies.ts', () => ({
  matchMovies: () => Promise.resolve([]),
}));

const EMPTY_NOT_FOUND = {
  movies: [],
  shows: [],
  seasons: [],
  episodes: [],
  people: [],
  users: [],
};

function historyResponse(
  { added = 0, updated = 0, notFound = {}, status = 200 }: {
    added?: number;
    updated?: number;
    notFound?: Record<string, unknown[]>;
    status?: number;
  },
) {
  return {
    status,
    body: {
      added: { movies: 0, episodes: added },
      updated: { movies: 0, episodes: updated },
      not_found: { ...EMPTY_NOT_FOUND, ...notFound },
    },
  };
}

function episode(tvdb: number): UniversalImportItem {
  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb },
    watched_at: '2022-07-31T23:57:00.000Z',
  };
}

function run(items: ReadonlyArray<UniversalImportItem>) {
  return syncToTrakt(items, { onProgress: vi.fn(), onError: vi.fn() });
}

describe('syncToTrakt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('synced count', () => {
    it('should report nothing synced when Trakt found none of the items', async () => {
      const items = [episode(1), episode(2)];
      historyAdd.mockResolvedValue(historyResponse({
        notFound: { episodes: [{ ids: { tvdb: 1 } }, { ids: { tvdb: 2 } }] },
      }));

      const result = await run(items);

      expect(result.syncedCount).toBe(0);
    });

    it('should report the count Trakt added rather than the count sent', async () => {
      const items = [episode(1), episode(2), episode(3)];
      historyAdd.mockResolvedValue(historyResponse({
        added: 1,
        notFound: { episodes: [{ ids: { tvdb: 2 } }, { ids: { tvdb: 3 } }] },
      }));

      const result = await run(items);

      expect(result.syncedCount).toBe(1);
    });

    it('should count items already in history as synced', async () => {
      historyAdd.mockResolvedValue(historyResponse({ added: 1, updated: 1 }));

      const result = await run([episode(1), episode(2)]);

      expect(result.syncedCount).toBe(2);
    });
  });

  describe('items Trakt refused', () => {
    it('should return the items listed under not_found', async () => {
      const kept = episode(1);
      const refused = episode(2);
      historyAdd.mockResolvedValue(historyResponse({
        added: 1,
        notFound: { episodes: [{ ids: { tvdb: 2 } }] },
      }));

      const result = await run([kept, refused]);

      expect(result.rejected).toEqual([refused]);
      expect(result.unresolved).toEqual([]);
    });

    it('should treat a refused request as rejected, not synced', async () => {
      const items = [episode(1), episode(2)];
      historyAdd.mockResolvedValue({ status: 420, body: {} });

      const result = await run(items);

      expect(result.syncedCount).toBe(0);
      expect(result.rejected).toEqual(items);
    });
  });

  describe('items that cannot be sent', () => {
    it('should skip an episode with no id and no position', async () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
        watched_at: '2022-07-31T23:57:00.000Z',
      };

      const result = await run([item]);

      expect(result.unresolved).toEqual([item]);
      expect(result.syncedCount).toBe(0);
    });

    it('should not send a request when nothing is sendable', async () => {
      await run([{ action: 'history', type: 'episode', ids: {} }]);

      expect(historyAdd).not.toHaveBeenCalled();
    });

    it('should still send the items that are sendable', async () => {
      const sendable = episode(1);
      const skipped: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
      };
      historyAdd.mockResolvedValue(historyResponse({ added: 1 }));

      const result = await run([sendable, skipped]);

      expect(historyAdd).toHaveBeenCalledWith({
        body: {
          movies: [],
          shows: [],
          episodes: [{
            ids: { tvdb: 1 },
            watched_at: '2022-07-31T23:57:00.000Z',
          }],
        },
      });
      expect(result.syncedCount).toBe(1);
      expect(result.unresolved).toEqual([skipped]);
    });
  });

  describe('across actions', () => {
    it('should sum synced counts from every endpoint it called', async () => {
      historyAdd.mockResolvedValue(historyResponse({ added: 1 }));
      watchlistAdd.mockResolvedValue({
        status: 200,
        body: {
          added: { movies: 1, shows: 0, seasons: 0, episodes: 0 },
          existing: { movies: 0, shows: 0, seasons: 0, episodes: 0 },
          not_found: EMPTY_NOT_FOUND,
        },
      });
      ratingsAdd.mockResolvedValue({
        status: 200,
        body: {
          added: { movies: 1, shows: 0, seasons: 0, episodes: 0 },
          not_found: EMPTY_NOT_FOUND,
        },
      });

      const result = await run([
        episode(1),
        { action: 'watchlist', type: 'movie', ids: { tmdb: 550 } },
        { action: 'ratings', type: 'movie', ids: { tmdb: 680 }, rating: 9 },
      ]);

      expect(result.syncedCount).toBe(3);
    });
  });
});
