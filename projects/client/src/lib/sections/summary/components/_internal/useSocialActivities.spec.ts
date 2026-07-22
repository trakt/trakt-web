import { MediaSocialResponseMock } from '$mocks/data/summary/common/response/MediaSocialResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useSocialActivities } from './useSocialActivities.ts';

describe('store: useSocialActivities', () => {
  it('should drop duplicate entries for the same user (#2834)', async () => {
    const harry = MediaSocialResponseMock.at(0);

    server.use(
      http.get(
        'http://localhost/movies/duplicated-social/social',
        () => HttpResponse.json([harry, harry]),
      ),
    );

    const entries = await runQuery({
      factory: () =>
        useSocialActivities(
          valueObservable({ type: 'movie', slug: 'duplicated-social' }),
        ).entries,
      waitFor: (value) => value.length > 0,
    });

    expect(entries).toHaveLength(1);
    expect(entries.at(0)?.user.username).toBe(harry?.user.username);
  });
});
