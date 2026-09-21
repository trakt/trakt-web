import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { describe, expect, it } from 'vitest';
import { resolvePosterSource } from './resolvePosterSource.ts';

const POSTER_URL =
  'https://media.trakt.tv/images/shows/000/155/536/posters/medium/c15067608d.jpg.webp';

describe('util: resolvePosterSource', () => {
  describe('when the media has no poster', () => {
    it('should inline the bundled placeholder', () => {
      const result = resolvePosterSource(MEDIA_POSTER_PLACEHOLDER);

      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('when the media has a poster', () => {
    it('should drop the webp extension', () => {
      const result = resolvePosterSource(POSTER_URL);

      expect(result).toBe(POSTER_URL.replace('.webp', ''));
    });

    it('should leave a plain jpeg url untouched', () => {
      const url = POSTER_URL.replace('.webp', '');

      expect(resolvePosterSource(url)).toBe(url);
    });
  });
});
