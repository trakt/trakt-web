import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { http, HttpResponse } from 'msw';
import { combineLatest } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useFreeAllTimeStats } from './useFreeAllTimeStats.ts';

describe('store: useFreeAllTimeStats', () => {
  beforeEach(() => {
    setAuthorization(true);
    server.use(
      http.get('http://localhost/users/me/comments/all/all', () =>
        HttpResponse.json([], {
          headers: { 'x-pagination-item-count': '3' },
        }),
      ),
    );
  });

  it('should settle with zero ratings when the ratings request fails', async () => {
    server.use(
      http.get(
        'http://localhost/users/me/ratings/movies',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const [details, isLoading] = await runQuery({
      factory: () => {
        const stats = useFreeAllTimeStats(valueObservable(true));
        return combineLatest([stats.details, stats.isLoading]);
      },
      waitFor: ([, loading]) => !loading,
    });

    expect(isLoading).toBe(false);
    expect(details?.ratingCount).toBe(0);
    expect(details?.minuteCount).toBeNull();
  }, 15_000);
});
