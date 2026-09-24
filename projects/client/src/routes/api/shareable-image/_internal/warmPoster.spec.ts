import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { warmPoster } from './warmPoster.ts';

const POSTER_URL =
  'https://media.trakt.tv/images/shows/000/155/536/posters/medium/c15067608d.jpg';

function trackPosterRequests(respond: () => Response) {
  const requested: string[] = [];

  server.use(
    http.get(POSTER_URL, ({ request }) => {
      requested.push(request.url);
      return respond();
    }),
  );

  return requested;
}

describe('util: warmPoster', () => {
  it('should fetch a remote poster', async () => {
    const requested = trackPosterRequests(() =>
      new HttpResponse(new Uint8Array([255, 216, 255]), {
        headers: { 'content-type': 'image/jpeg' },
      })
    );

    await warmPoster({ posterUrl: POSTER_URL, fetch: globalThis.fetch });

    expect(requested).toEqual([POSTER_URL]);
  });

  it('should skip an inline poster', async () => {
    const requested: string[] = [];
    const fetch: typeof globalThis.fetch = (input, init) => {
      requested.push(String(input));
      return globalThis.fetch(input, init);
    };

    await warmPoster({ posterUrl: 'data:image/png;base64,AAAA', fetch });

    expect(requested).toEqual([]);
  });

  it('should swallow a failed fetch', async () => {
    trackPosterRequests(() => HttpResponse.error());

    await expect(
      warmPoster({ posterUrl: POSTER_URL, fetch: globalThis.fetch }),
    ).resolves.toBeUndefined();
  });
});
