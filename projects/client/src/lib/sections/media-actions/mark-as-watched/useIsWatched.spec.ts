import { executeOrEnqueue } from '$lib/features/offline/executeOrEnqueue.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useIsWatched } from './useIsWatched.ts';

const MOVIE_ID = 999_999;

function failHistorySync() {
  server.use(
    http.post('http://localhost/sync/history', () => HttpResponse.error()),
    http.post(
      'http://localhost/sync/history/remove',
      () => HttpResponse.error(),
    ),
  );
}

describe('store: useIsWatched', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  describe('offline overlay', () => {
    it('should report a queued offline watch as watched', async () => {
      failHistorySync();

      await executeOrEnqueue({
        endpoint: 'history:add',
        keys: [toMediaKey('movie', MOVIE_ID)],
        body: { movies: [{ ids: { trakt: MOVIE_ID } }] },
        invalidations: ['invalidate:mark_as_watched:movie'],
      });

      const { isWatched } = await renderStore(() =>
        useIsWatched({ type: 'movie', media: { id: MOVIE_ID } })
      );

      expect(await firstValueFrom(isWatched)).toBe(true);
    });

    it('should report a queued offline unwatch as not watched', async () => {
      failHistorySync();

      await executeOrEnqueue({
        endpoint: 'history:remove',
        keys: [toMediaKey('movie', MOVIE_ID)],
        body: { movies: [{ ids: { trakt: MOVIE_ID } }] },
        invalidations: ['invalidate:mark_as_watched:movie'],
      });

      const { isWatched } = await renderStore(() =>
        useIsWatched({ type: 'movie', media: { id: MOVIE_ID } })
      );

      expect(await firstValueFrom(isWatched)).toBe(false);
    });
  });
});
