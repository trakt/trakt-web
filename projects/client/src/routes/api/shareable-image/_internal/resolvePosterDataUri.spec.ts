import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { describe, expect, it, vi } from 'vitest';
import { resolvePosterDataUri } from './resolvePosterDataUri.ts';

type PosterFetch = Parameters<typeof resolvePosterDataUri>[0]['fetch'];

const POSTER_URL =
  'https://media.trakt.tv/images/shows/000/155/536/posters/medium/c15067608d.jpg.webp';

const PLACEHOLDER_DATA_URI = /^data:image\/png;base64,/;

const jpegResponse = () =>
  new Response(new Uint8Array([255, 216, 255, 224]), {
    headers: { 'content-type': 'image/jpeg' },
  });

describe('util: resolvePosterDataUri', () => {
  describe('when the media has no poster', () => {
    it('should inline the bundled placeholder', async () => {
      const fetch = vi.fn<PosterFetch>();

      const result = await resolvePosterDataUri({
        posterUrl: MEDIA_POSTER_PLACEHOLDER,
        fetch,
      });

      expect(result).toMatch(PLACEHOLDER_DATA_URI);
    });

    it('should not request the placeholder over the network', async () => {
      const fetch = vi.fn<PosterFetch>();

      await resolvePosterDataUri({
        posterUrl: MEDIA_POSTER_PLACEHOLDER,
        fetch,
      });

      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('when the media has a poster', () => {
    it('should request the poster without the webp extension', async () => {
      const fetch = vi.fn<PosterFetch>().mockResolvedValue(jpegResponse());

      await resolvePosterDataUri({ posterUrl: POSTER_URL, fetch });

      expect(fetch).toHaveBeenCalledWith(
        POSTER_URL.replace('.webp', ''),
        expect.anything(),
      );
    });

    it('should return the poster as a data uri', async () => {
      const fetch = vi.fn<PosterFetch>().mockResolvedValue(jpegResponse());

      const result = await resolvePosterDataUri({
        posterUrl: POSTER_URL,
        fetch,
      });

      expect(result).toMatch(/^data:image\/jpeg;base64,/);
    });
  });

  describe('when the poster request fails', () => {
    it('should fall back to the placeholder on a failed response', async () => {
      const fetch = vi.fn<PosterFetch>().mockResolvedValue(
        new Response('connection timed out', { status: 522 }),
      );

      const result = await resolvePosterDataUri({
        posterUrl: POSTER_URL,
        fetch,
      });

      expect(result).toMatch(PLACEHOLDER_DATA_URI);
    });

    it('should fall back to the placeholder when the request throws', async () => {
      const fetch = vi.fn<PosterFetch>().mockRejectedValue(
        new Error('Network connection lost.'),
      );

      const result = await resolvePosterDataUri({
        posterUrl: POSTER_URL,
        fetch,
      });

      expect(result).toMatch(PLACEHOLDER_DATA_URI);
    });
  });
});
