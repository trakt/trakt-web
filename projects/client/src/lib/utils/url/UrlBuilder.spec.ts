import { describe, expect, it } from 'vitest';
import { UrlBuilder } from './UrlBuilder.ts';

describe('util: UrlBuilder', () => {
  describe('episodeDrawer', () => {
    it('should point at the show summary page with the episode drawer params', () => {
      const url = UrlBuilder.episodeDrawer('the-penguin', 1, 3);

      expect(url).to.equal(
        '/shows/the-penguin?view=episode&season=1&episode=3',
      );
    });

    it('should support specials (season 0)', () => {
      const url = UrlBuilder.episodeDrawer('silo', 0, 1);

      expect(url).to.equal('/shows/silo?view=episode&season=0&episode=1');
    });
  });

  describe('seasonDrawer', () => {
    it('should point at the show summary page with the seasons drawer params', () => {
      const url = UrlBuilder.seasonDrawer('breaking-bad', 2);

      expect(url).to.equal('/shows/breaking-bad?view=seasons&season=2');
    });

    it('should support specials (season 0)', () => {
      const url = UrlBuilder.seasonDrawer('silo', 0);

      expect(url).to.equal('/shows/silo?view=seasons&season=0');
    });
  });
});
