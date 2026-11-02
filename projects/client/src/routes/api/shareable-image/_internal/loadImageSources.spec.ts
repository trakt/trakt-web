import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { loadImageSources } from './loadImageSources.ts';

const POSTER_URL = 'https://media.trakt.tv/shows/155536/medium/poster.webp';
const MISSING_URL = 'https://media.trakt.tv/shows/1/medium/poster.webp';
const BROKEN_URL = 'https://media.trakt.tv/shows/2/medium/poster.webp';

describe('util: loadImageSources', () => {
  it('should keep only the images that loaded', async () => {
    server.use(
      http.get(
        POSTER_URL,
        () => new HttpResponse(new Uint8Array([255, 216, 255])),
      ),
      http.get(MISSING_URL, () => new HttpResponse(null, { status: 404 })),
      http.get(BROKEN_URL, () => new HttpResponse(null, { status: 500 })),
    );

    const images = await loadImageSources({
      urls: [POSTER_URL, MISSING_URL, BROKEN_URL, POSTER_URL, null],
      fetch: globalThis.fetch,
    });

    expect(images.map((image) => image.src)).toEqual([POSTER_URL]);
  });
});
