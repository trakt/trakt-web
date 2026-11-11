import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import type { UniversalImportItem } from './ImportTypes.ts';
import { syncToTrakt } from './syncToTrakt.ts';

vi.mock('$lib/utils/retry/retryDelay.ts', () => ({ retryDelay: () => 0 }));

const HISTORY_URL = 'http://localhost/sync/history';
const WATCHLIST_URL = 'http://localhost/sync/watchlist';

const watched_at = '2024-01-02T03:04:05.000Z';

const episode: UniversalImportItem = {
  action: 'history',
  type: 'episode',
  ids: { tvdb: 555 },
  showTvdb: 100,
  season: 1,
  episode: 2,
  watched_at,
};

const noNotFound = { not_found: { movies: [], shows: [], episodes: [] } };

function callbacks() {
  return { onProgress: vi.fn(), onError: vi.fn() };
}

function respondInOrder(url: string, responses: ReadonlyArray<() => Response>) {
  const bodies: unknown[] = [];
  server.use(
    http.post(url, async ({ request }) => {
      bodies.push(await request.json());
      const respond = responses.at(
        Math.min(bodies.length, responses.length) - 1,
      );
      return respond?.() ?? new HttpResponse(null, { status: 201 });
    }),
  );
  return bodies;
}

const created = (body: object) => () =>
  HttpResponse.json(body, { status: 201 });

describe('syncToTrakt', () => {
  describe('history not found', () => {
    it('should retry a not found episode by show, season and number', async () => {
      const bodies = respondInOrder(HISTORY_URL, [
        created({
          not_found: { episodes: [{ ids: { tvdb: 555 }, watched_at }] },
        }),
        created(noNotFound),
      ]);

      const result = await syncToTrakt([episode], callbacks());

      expect(bodies).toHaveLength(2);
      expect(bodies.at(1)).toMatchObject({
        shows: [
          {
            ids: { tvdb: 100 },
            seasons: [{ number: 1, episodes: [{ number: 2, watched_at }] }],
          },
        ],
      });
      expect(result.unresolved).toEqual([]);
      expect(result.errorCount).toBe(0);
    });

    it('should report episodes the positional retry still cannot find as unresolved', async () => {
      const positionalMiss = {
        not_found: {
          shows: [
            {
              ids: { tvdb: 100 },
              seasons: [{ number: 1, episodes: [{ number: 2 }] }],
            },
          ],
        },
      };
      respondInOrder(HISTORY_URL, [
        created({
          not_found: { episodes: [{ ids: { tvdb: 555 }, watched_at }] },
        }),
        created(positionalMiss),
      ]);

      const result = await syncToTrakt([episode], callbacks());

      expect(result.unresolved).toEqual([episode]);
      expect(result.errorCount).toBe(0);
    });

    it('should not retry an episode without a show id', async () => {
      const orphan: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: { tvdb: 556 },
        season: 1,
        episode: 3,
        watched_at,
      };
      const bodies = respondInOrder(HISTORY_URL, [
        created({
          not_found: { episodes: [{ ids: { tvdb: 556 }, watched_at }] },
        }),
      ]);

      const result = await syncToTrakt([orphan], callbacks());

      expect(bodies).toHaveLength(1);
      expect(result.unresolved).toEqual([orphan]);
    });

    it('should not retry again when episodes already match by position', async () => {
      const bodies = respondInOrder(HISTORY_URL, [
        created({
          not_found: {
            shows: [
              {
                ids: { tvdb: 100 },
                seasons: [{ number: 1, episodes: [{ number: 2 }] }],
              },
            ],
          },
        }),
      ]);

      const result = await syncToTrakt([episode], {
        ...callbacks(),
        episodeMatch: 'positional',
      });

      expect(bodies).toHaveLength(1);
      expect(result.unresolved).toEqual([episode]);
    });

    it('should only report the plays that were not found', async () => {
      const found: UniversalImportItem = {
        ...episode,
        ids: { tvdb: 600 },
        episode: 5,
      };
      respondInOrder(HISTORY_URL, [
        created({
          not_found: { episodes: [{ ids: { tvdb: 600 }, watched_at }] },
        }),
        created({
          not_found: {
            shows: [
              {
                ids: { tvdb: 100 },
                seasons: [{ number: 1, episodes: [{ number: 5 }] }],
              },
            ],
          },
        }),
      ]);

      const result = await syncToTrakt([episode, found], callbacks());

      expect(result.unresolved).toEqual([found]);
    });

    it('should report a not found movie as unresolved', async () => {
      const movie: UniversalImportItem = {
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt0000001' },
        watched_at,
      };
      respondInOrder(HISTORY_URL, [
        created({
          not_found: { movies: [{ ids: { imdb: 'tt0000001' }, watched_at }] },
        }),
      ]);

      const result = await syncToTrakt([movie], callbacks());

      expect(result.unresolved).toEqual([movie]);
    });
  });

  describe('watchlist not found', () => {
    it('should report not found watchlist items as unresolved', async () => {
      const show: UniversalImportItem = {
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 700 },
      };
      respondInOrder(WATCHLIST_URL, [
        created({ not_found: { shows: [{ ids: { tvdb: 700 } }] } }),
      ]);

      const result = await syncToTrakt([show], callbacks());

      expect(result.unresolved).toEqual([show]);
    });
  });

  describe('failed responses', () => {
    it('should retry a rate limited request and succeed', async () => {
      const bodies = respondInOrder(HISTORY_URL, [
        () =>
          new HttpResponse(null, {
            status: 429,
            headers: { 'Retry-After': '0' },
          }),
        created(noNotFound),
      ]);
      const { onError } = callbacks();

      const result = await syncToTrakt([episode], {
        ...callbacks(),
        onError,
      });

      expect(bodies).toHaveLength(2);
      expect(onError).not.toHaveBeenCalled();
      expect(result.errorCount).toBe(0);
    });

    it('should count a batch as failed when the status stays non 2xx', async () => {
      const bodies = respondInOrder(HISTORY_URL, [
        () => new HttpResponse(null, { status: 500 }),
      ]);
      const onError = vi.fn();

      const result = await syncToTrakt([episode], {
        onProgress: vi.fn(),
        onError,
      });

      expect(bodies).toHaveLength(3);
      expect(onError).toHaveBeenCalledWith('Request failed with status 500');
      expect(result.errorCount).toBe(1);
      expect(result.unresolved).toEqual([]);
    });
  });
});
