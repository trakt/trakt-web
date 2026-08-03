import { describe, expect, it } from 'vitest';
import { resolveLegacyRedirect } from './resolveLegacyRedirect.ts';

describe('util: resolveLegacyRedirect', () => {
  describe('media structural rename', () => {
    it('should map singular show to plural', () => {
      expect(resolveLegacyRedirect('/show/breaking-bad')).toBe(
        '/shows/breaking-bad',
      );
    });

    it('should map singular show season to the seasons drawer', () => {
      expect(resolveLegacyRedirect('/show/breaking-bad/season/2')).toBe(
        '/shows/breaking-bad?view=seasons&season=2',
      );
    });

    it('should map singular show episode to the episode drawer', () => {
      expect(
        resolveLegacyRedirect('/show/breaking-bad/season/2/episode/5'),
      ).toBe('/shows/breaking-bad?view=episode&season=2&episode=5');
    });

    it('should map singular movie to plural', () => {
      expect(resolveLegacyRedirect('/movie/heretic-2024')).toBe(
        '/movies/heretic-2024',
      );
    });

    it('should map singular user to plural', () => {
      expect(resolveLegacyRedirect('/user/sean')).toBe('/users/sean');
    });
  });

  describe('chart / collection pages', () => {
    it('should map discover-backed show charts to discover with mode', () => {
      expect(resolveLegacyRedirect('/shows/trending')).toBe(
        '/discover/trending?mode=show',
      );
      expect(resolveLegacyRedirect('/shows/popular')).toBe(
        '/discover/popular?mode=show',
      );
      expect(resolveLegacyRedirect('/shows/anticipated')).toBe(
        '/discover/anticipated?mode=show',
      );
    });

    it('should map discover-backed movie charts to discover with mode', () => {
      expect(resolveLegacyRedirect('/movies/trending')).toBe(
        '/discover/trending?mode=movie',
      );
      expect(resolveLegacyRedirect('/movies/releases')).toBe(
        '/discover/releases?mode=movie',
      );
    });

    it('should fold charts without a drilldown to discover with mode', () => {
      expect(resolveLegacyRedirect('/shows/played')).toBe(
        '/discover?mode=show',
      );
      expect(resolveLegacyRedirect('/shows/library')).toBe(
        '/discover?mode=show',
      );
      expect(resolveLegacyRedirect('/movies/boxoffice')).toBe(
        '/discover?mode=movie',
      );
    });

    it('should map the bare media index to discover with mode', () => {
      expect(resolveLegacyRedirect('/shows')).toBe('/discover?mode=show');
      expect(resolveLegacyRedirect('/movies')).toBe('/discover?mode=movie');
    });
  });

  describe('media sub-routes fold to nearest parent', () => {
    it('should fold show sub-routes to the show page', () => {
      expect(resolveLegacyRedirect('/shows/breaking-bad/comments')).toBe(
        '/shows/breaking-bad',
      );
      expect(resolveLegacyRedirect('/shows/breaking-bad/credits')).toBe(
        '/shows/breaking-bad',
      );
    });

    it('should fold seasons/all to the seasons drawer on the first season', () => {
      expect(resolveLegacyRedirect('/shows/breaking-bad/seasons/all')).toBe(
        '/shows/breaking-bad?view=seasons&season=1',
      );
    });

    it('should fold season sub-routes to the season drawer', () => {
      expect(
        resolveLegacyRedirect('/shows/breaking-bad/seasons/2/comments'),
      ).toBe('/shows/breaking-bad?view=seasons&season=2');
    });

    it('should fold episode sub-routes to the episode drawer', () => {
      expect(
        resolveLegacyRedirect(
          '/shows/breaking-bad/seasons/2/episodes/5/comments',
        ),
      ).toBe('/shows/breaking-bad?view=episode&season=2&episode=5');
    });

    it('should fold movie sub-routes to the movie page', () => {
      expect(resolveLegacyRedirect('/movies/heretic-2024/releases')).toBe(
        '/movies/heretic-2024',
      );
    });

    it('should fold person lists to the person page', () => {
      expect(resolveLegacyRedirect('/people/bryan-cranston/lists')).toBe(
        '/people/bryan-cranston',
      );
    });
  });

  describe('user profile sub-routes', () => {
    it('should map history to the profile history page', () => {
      expect(resolveLegacyRedirect('/users/sean/history')).toBe(
        '/profile/sean/history',
      );
    });

    it('should map favorites to the profile favorites page', () => {
      expect(resolveLegacyRedirect('/users/sean/favorites')).toBe(
        '/profile/sean/favorites',
      );
    });

    it('should map ratings and comments to the profile activity drawer', () => {
      expect(resolveLegacyRedirect('/users/sean/ratings')).toBe(
        '/profile/sean?view=activity',
      );
      expect(resolveLegacyRedirect('/users/sean/comments/movies')).toBe(
        '/profile/sean?view=activity',
      );
    });

    it('should map hidden to the signed-in user media progress page', () => {
      expect(resolveLegacyRedirect('/users/sean/hidden')).toBe(
        '/profile/me/progress?mode=media',
      );
    });

    it('should fold remaining profile sub-routes to the profile home', () => {
      expect(resolveLegacyRedirect('/users/sean/likes')).toBe('/profile/sean');
      expect(resolveLegacyRedirect('/users/sean/network')).toBe(
        '/profile/sean',
      );
    });

    it('should fold numeric-id user lists to the lists overview', () => {
      expect(resolveLegacyRedirect('/users/sean/lists/12345')).toBe(
        '/users/sean/lists',
      );
    });
  });

  describe('top-level pages', () => {
    it('should map dashboard to home', () => {
      expect(resolveLegacyRedirect('/dashboard')).toBe('/home');
      expect(resolveLegacyRedirect('/dashboard/on_deck')).toBe('/home');
    });

    it('should map official lists', () => {
      expect(resolveLegacyRedirect('/officiallist/best-of-2024')).toBe(
        '/lists/official/best-of-2024',
      );
    });

    it('should map oauth app management to the apps settings', () => {
      expect(resolveLegacyRedirect('/oauth/applications')).toBe(
        '/settings/apps/api',
      );
      expect(resolveLegacyRedirect('/oauth/authorized_applications')).toBe(
        '/settings/apps/connected',
      );
    });

    it('should map oauth app pages to their settings equivalent', () => {
      expect(resolveLegacyRedirect('/oauth/applications/new')).toBe(
        '/settings/apps/api/new',
      );
      expect(resolveLegacyRedirect('/oauth/applications/901')).toBe(
        '/settings/apps/api/901',
      );
      expect(resolveLegacyRedirect('/oauth/applications/901/edit')).toBe(
        '/settings/apps/api/901/edit',
      );
    });
  });

  describe('watch now deep links hop to the v2 host', () => {
    it('should map a watch now link to the watchnow host', () => {
      expect(resolveLegacyRedirect('/watchnow/265852339')).toBe(
        'https://watchnow.trakt.tv/watchnow/265852339',
      );
    });

    it('should tolerate a trailing slash', () => {
      expect(resolveLegacyRedirect('/watchnow/265852339/')).toBe(
        'https://watchnow.trakt.tv/watchnow/265852339',
      );
    });

    it.each([
      '/watchnow',
      '/watchnow/sources',
      '/watchnow/sources/us',
      '/watchnow/movie/1390/justwatch/us/netflix',
    ])('should leave the rest of the namespace alone: %s', (path) => {
      expect(resolveLegacyRedirect(path)).toBeNull();
    });
  });

  describe('live oauth endpoints are never hijacked', () => {
    it.each([
      '/oauth/authorize',
      '/oauth/authorize/native',
      '/oauth/token',
      '/oauth/token/info',
      '/oauth/revoke',
      '/oauth/introspect',
      '/oauth/userinfo',
      '/oauth/consent',
      '/oauth/device/code',
    ])('should return null for %s', (path) => {
      expect(resolveLegacyRedirect(path)).toBeNull();
    });
  });

  describe('no sensible target falls back to the landing page', () => {
    it.each([
      '/seasons/12345',
      '/episodes/67890',
      '/comments/all/movies',
      '/share/abc123',
      '/tmdb/updates',
    ])('should redirect %s to the landing page', (path) => {
      expect(resolveLegacyRedirect(path)).toBe('/');
    });
  });

  describe('numeric-id lists fall back to the user lists landing', () => {
    it.each([
      '/lists/12345',
      '/watchlist/12345',
    ])('should redirect %s to /users/me/lists', (path) => {
      expect(resolveLegacyRedirect(path)).toBe('/users/me/lists');
    });
  });

  describe('native paths pass through untouched', () => {
    it.each([
      '/shows/breaking-bad',
      '/shows/breaking-bad/lists',
      '/shows/breaking-bad/related',
      '/shows/breaking-bad/seasons',
      '/shows/breaking-bad/seasons/2',
      '/shows/breaking-bad/seasons/2/episodes/5',
      '/movies/heretic-2024',
      '/movies/heretic-2024/lists',
      '/people/bryan-cranston',
      '/users/sean',
      '/users/sean/lists',
      '/users/sean/watchlist',
      '/users/sean/progress',
      '/users/sean/collection',
      '/calendar',
      '/search',
      '/settings/advanced',
      '/',
      '/home',
    ])('should return null for %s', (path) => {
      expect(resolveLegacyRedirect(path)).toBeNull();
    });
  });
});
