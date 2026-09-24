import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { loadPosterImages } from './loadPosterImages.ts';

const POSTER_URL =
  'https://media.trakt.tv/images/shows/000/155/536/posters/medium/c15067608d.jpg';

describe('util: loadPosterImages', () => {
  it('should load a remote poster keyed by its url', async () => {
    server.use(
      http.get(
        POSTER_URL,
        () =>
          new HttpResponse(new Uint8Array([255, 216, 255]), {
            headers: { 'content-type': 'image/jpeg' },
          }),
      ),
    );

    const [image, ...rest] = await loadPosterImages({
      posterUrl: POSTER_URL,
      fetch: globalThis.fetch,
    });

    expect(rest).toEqual([]);
    expect(image?.src).toBe(POSTER_URL);
    expect([...new Uint8Array(image?.data as ArrayBuffer)]).toEqual([
      255,
      216,
      255,
    ]);
  });

  it('should leave an inline poster to the renderer', async () => {
    const requested: string[] = [];
    const fetch: typeof globalThis.fetch = (input, init) => {
      requested.push(String(input));
      return globalThis.fetch(input, init);
    };

    const images = await loadPosterImages({
      posterUrl: 'data:image/png;base64,AAAA',
      fetch,
    });

    expect(images).toEqual([]);
    expect(requested).toEqual([]);
  });

  it('should reject when the poster is unavailable', async () => {
    server.use(
      http.get(POSTER_URL, () => new HttpResponse(null, { status: 404 })),
    );

    await expect(
      loadPosterImages({ posterUrl: POSTER_URL, fetch: globalThis.fetch }),
    ).rejects.toThrow('404');
  });
});
