import { NOOP_FN } from '$lib/utils/constants.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { clearLibrary } from './clearLibrary.ts';

describe('clearLibrary', () => {
  it('should remove only the exported movie and episode IDs', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.post(
        'http://localhost/sync/collection/remove',
        async ({ request }) => {
          const body = await request.json() as {
            movies?: unknown[];
            episodes?: unknown[];
          };
          bodies.push(body);
          return HttpResponse.json({
            deleted: {
              movies: body.movies?.length ?? 0,
              episodes: body.episodes?.length ?? 0,
            },
          });
        },
      ),
    );
    const onComplete = vi.fn();
    await clearLibrary({ movies: new Set([1, 3]), episodes: new Set([2]) }, {
      onProgress: NOOP_FN,
      onError: NOOP_FN,
      onComplete,
    });
    expect(bodies).toEqual([
      { movies: [{ ids: { trakt: 1 } }, { ids: { trakt: 3 } }] },
      { episodes: [{ ids: { trakt: 2 } }] },
    ]);
    expect(onComplete).toHaveBeenCalledWith(true, 0);
  });

  it('should report failure when the API does not remove the requested items', async () => {
    server.use(
      http.post(
        'http://localhost/sync/collection/remove',
        () => HttpResponse.json({ deleted: { movies: 0, episodes: 0 } }),
      ),
    );
    const onComplete = vi.fn();
    const onError = vi.fn();
    await clearLibrary({ movies: new Set([1]), episodes: new Set() }, {
      onProgress: NOOP_FN,
      onError,
      onComplete,
    });
    expect(onError).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(false, 1);
  });

  it('should not send removal requests after cancellation', async () => {
    const handler = vi.fn(() => HttpResponse.json({}));
    server.use(http.post('http://localhost/sync/collection/remove', handler));
    const controller = new AbortController();
    controller.abort();
    const onComplete = vi.fn();
    await clearLibrary({ movies: new Set([1]), episodes: new Set([2]) }, {
      onProgress: NOOP_FN,
      onError: NOOP_FN,
      onComplete,
      signal: controller.signal,
    });
    expect(handler).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(false, 0);
  });
});
