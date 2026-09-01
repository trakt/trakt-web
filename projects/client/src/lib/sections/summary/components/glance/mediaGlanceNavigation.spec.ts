import { beforeEach, describe, expect, it } from 'vitest';
import { MediaGlanceDrawers } from './MediaGlanceDrawers.ts';
import { mediaGlanceNavigation } from './mediaGlanceNavigation.ts';

const searchParamsOf = (url: string) => {
  window.history.replaceState({}, '', url);
  return new URL(window.location.href).searchParams;
};

describe('mediaGlanceNavigation', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/discover/trending');
  });

  describe('reading the current drawer', () => {
    it('should resolve a media glance from its params', () => {
      const { drawer, type, slug } = mediaGlanceNavigation(
        searchParamsOf(
          '/discover/trending?view=glance&glance_type=show&glance_slug=silo',
        ),
      );

      expect(drawer).toBe(MediaGlanceDrawers.Media);
      expect(type).toBe('show');
      expect(slug).toBe('silo');
    });

    it('should resolve an episode glance from its params', () => {
      const { drawer, slug, season, episode } = mediaGlanceNavigation(
        searchParamsOf(
          '/discover/trending?view=glance-episode&glance_slug=silo&glance_season=2&glance_episode=3',
        ),
      );

      expect(drawer).toBe(MediaGlanceDrawers.Episode);
      expect(slug).toBe('silo');
      expect(season).toBe(2);
      expect(episode).toBe(3);
    });

    it('should resolve a season glance from its params', () => {
      const { drawer, season } = mediaGlanceNavigation(
        searchParamsOf(
          '/discover/trending?view=glance-season&glance_slug=silo&glance_season=1',
        ),
      );

      expect(drawer).toBe(MediaGlanceDrawers.Season);
      expect(season).toBe(1);
    });

    it('should ignore a drawer it does not own', () => {
      const { drawer } = mediaGlanceNavigation(
        searchParamsOf('/shows/silo?view=episode&season=2&episode=3'),
      );

      expect(drawer).toBeNull();
    });

    it('should report nothing without params', () => {
      const { drawer, type, slug, season, episode } = mediaGlanceNavigation();

      expect(drawer).toBeNull();
      expect(type).toBeNull();
      expect(slug).toBeNull();
      expect(season).toBeNull();
      expect(episode).toBeNull();
    });
  });

  describe('rejecting malformed params', () => {
    it.each(['abc', '1.5', ''])(
      'should refuse "%s" as a season number',
      (value) => {
        const { season } = mediaGlanceNavigation(
          searchParamsOf(
            `/discover/trending?view=glance-season&glance_slug=silo&glance_season=${value}`,
          ),
        );

        expect(season).toBeNull();
      },
    );

    it('should refuse an unknown media type', () => {
      const { type } = mediaGlanceNavigation(
        searchParamsOf(
          '/discover/trending?view=glance&glance_type=person&glance_slug=silo',
        ),
      );

      expect(type).toBeNull();
    });
  });

  describe('building links', () => {
    it('should open a media glance over the current page', () => {
      const { buildMediaGlanceLink } = mediaGlanceNavigation();

      const { href, noscroll, replacestate } = buildMediaGlanceLink({
        type: 'movie',
        slug: 'heretic-2024',
      });
      const target = new URL(href);

      expect(target.pathname).toBe('/discover/trending');
      expect(target.searchParams.get('view')).toBe(MediaGlanceDrawers.Media);
      expect(target.searchParams.get('glance_type')).toBe('movie');
      expect(target.searchParams.get('glance_slug')).toBe('heretic-2024');
      expect(noscroll).toBe(true);
      expect(replacestate).toBe(true);
    });

    it('should open an episode glance over the current page', () => {
      const { buildEpisodeGlanceLink } = mediaGlanceNavigation();

      const target = new URL(
        buildEpisodeGlanceLink({ slug: 'silo', season: 2, episode: 3 }).href,
      );

      expect(target.pathname).toBe('/discover/trending');
      expect(target.searchParams.get('view')).toBe(MediaGlanceDrawers.Episode);
      expect(target.searchParams.get('glance_slug')).toBe('silo');
      expect(target.searchParams.get('glance_season')).toBe('2');
      expect(target.searchParams.get('glance_episode')).toBe('3');
    });

    it('should switch drawers when one glance replaces another', () => {
      searchParamsOf(
        '/discover/trending?view=glance&glance_type=show&glance_slug=silo',
      );
      const { buildSeasonGlanceLink } = mediaGlanceNavigation();

      const target = new URL(
        buildSeasonGlanceLink({ slug: 'community', season: 1 }).href,
      );
      const { drawer, slug, season } = mediaGlanceNavigation(
        target.searchParams,
      );

      expect(drawer).toBe(MediaGlanceDrawers.Season);
      expect(slug).toBe('community');
      expect(season).toBe(1);
    });
  });
});
