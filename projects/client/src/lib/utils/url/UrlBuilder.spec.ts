import { describe, expect, it } from 'vitest';
import { UrlBuilder } from './UrlBuilder.ts';

describe('util: UrlBuilder', () => {
  describe('external', () => {
    it('should build the wikipedia url in the given language', () => {
      expect(UrlBuilder.external.wikipedia('Keanu_Reeves')).to.equal(
        'https://en.wikipedia.org/wiki/Keanu_Reeves',
      );
      expect(UrlBuilder.external.wikipedia('Keanu_Reeves', 'pt')).to.equal(
        'https://pt.wikipedia.org/wiki/Keanu_Reeves',
      );
    });

    it('should build the tiktok, youtube and wikidata urls', () => {
      expect(UrlBuilder.external.tiktok('khaby.lame')).to.equal(
        'https://www.tiktok.com/@khaby.lame',
      );
      expect(UrlBuilder.external.youtube('UC0000000000000000000000')).to.equal(
        'https://www.youtube.com/channel/UC0000000000000000000000',
      );
      expect(UrlBuilder.external.wikidata('Q43416')).to.equal(
        'https://www.wikidata.org/wiki/Q43416',
      );
    });
  });

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

  describe('renewVip', () => {
    it('should point at the renew page', () => {
      expect(UrlBuilder.renewVip()).to.equal('vip/renew');
    });

    it('should carry the switch flow', () => {
      expect(UrlBuilder.renewVip('switch')).to.equal('vip/renew?flow=switch');
    });
  });

  describe('vip', () => {
    it('should point at the plain vip page without a source', () => {
      expect(UrlBuilder.vip()).to.equal('/vip');
    });

    it('should point at the plain vip page for a direct visit', () => {
      expect(UrlBuilder.vip('direct')).to.equal('/vip');
    });

    it('should carry the upsell source as a query param', () => {
      expect(UrlBuilder.vip('navbar-mobile')).to.equal(
        '/vip?source=navbar-mobile',
      );
    });
  });

  describe('og.support', () => {
    it('should point signed-in users at the help center', () => {
      expect(UrlBuilder.og.support('john')).to.equal(
        'https://support.trakt.tv',
      );
    });

    it('should open an email to support for signed-out users', () => {
      expect(UrlBuilder.og.support()).to.match(
        /^mailto:support@trakt\.tv\?subject=Trakt Support Request&body=/,
      );
    });
  });

  describe('category drilldowns', () => {
    it('should keep well known params in a stable shape and drop unset ones', () => {
      const url = UrlBuilder.watched({
        type: 'movie',
        sort_by: 'title',
        sort_how: 'asc',
        status: 'returning',
        watch_window: 7,
        display: 'show',
      });

      const params = new URL(url, 'http://localhost').searchParams;
      expect(params.get('sort_by')).toBe('title');
      expect(params.get('sort_how')).toBe('asc');
      expect(params.get('status')).toBe('returning');
      expect(params.get('watch_window')).toBe('7');
      expect(params.get('display')).toBe('show');
      expect(params.has('page')).toBe(false);
    });

    it('should serialise the search filters as encoded json', () => {
      const url = UrlBuilder.watched({
        type: 'movie',
        search: { genres: 'action', year: 2024, adult: false },
      });

      const raw = new URL(url, 'http://localhost').searchParams.get('search');
      expect(JSON.parse(decodeURIComponent(raw ?? ''))).toEqual({
        genres: 'action',
        year: 2024,
        adult: false,
      });
    });
  });

  describe('mixtape', () => {
    it('should be the plain route without params', () => {
      expect(UrlBuilder.mixtape()).to.equal('/discover/mixtape');
    });

    it('should serialise picks, skips and kept rounds', () => {
      const url = UrlBuilder.mixtape({
        type: 'movie',
        picks: [1, 2],
        skips: [3],
        kept: [[4, 5], [6]],
        savedTo: 9,
        view: 'results',
        source: 'navbar',
      });

      const params = new URL(url, 'http://localhost').searchParams;
      expect(params.get('type')).toBe('movie');
      expect(params.get('picks')).toBe('1,2');
      expect(params.get('skips')).toBe('3');
      expect(params.get('kept')).toBe('4,5~6');
      expect(params.get('to')).toBe('9');
      expect(params.get('view')).toBe('results');
      expect(params.get('source')).toBe('navbar');
    });

    it('should drop empty lists and a null saved list', () => {
      const url = UrlBuilder.mixtape({
        picks: [],
        skips: [],
        kept: [],
        savedTo: null,
      });

      expect(url).to.equal('/discover/mixtape');
    });
  });

  describe('settings', () => {
    it('should drop a null service from the streaming service params', () => {
      expect(
        UrlBuilder.settings.streamingServices({
          connection: 'ok',
          service: null,
        }),
      ).to.equal('/settings/streaming-services?connection=ok');
    });
  });
});
