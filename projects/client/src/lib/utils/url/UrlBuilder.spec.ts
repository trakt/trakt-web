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
});
