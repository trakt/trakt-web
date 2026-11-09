import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { describe, expect, it } from 'vitest';
import { resolvePosterSource } from './resolvePosterSource.ts';

const POSTER_URL = 'https://media.trakt.tv/movies/491363/medium/poster.webp';

describe('util: resolvePosterSource', () => {
  describe('when the media has no poster', () => {
    it('should inline the bundled placeholder', () => {
      const result = resolvePosterSource(MEDIA_POSTER_PLACEHOLDER);

      expect(result).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('when the media has a poster', () => {
    it('should keep the webp poster url', () => {
      expect(resolvePosterSource(POSTER_URL)).toBe(POSTER_URL);
    });
  });
});
