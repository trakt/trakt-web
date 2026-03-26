import { describe, expect, it } from 'vitest';
import { EPISODE_IDS, MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

describe('pickIds', () => {
  describe('with MOVIE_IDS priority', () => {
    it('should return imdb first when available', () => {
      expect(pickIds({ imdb: 'tt1234567', tmdb: 1, trakt: 2 }, MOVIE_IDS))
        .toEqual({ imdb: 'tt1234567' });
    });

    it('should fall back to tmdb when imdb is absent', () => {
      expect(pickIds({ tmdb: 42, trakt: 2 }, MOVIE_IDS)).toEqual({ tmdb: 42 });
    });

    it('should fall back to trakt when imdb and tmdb are absent', () => {
      expect(pickIds({ trakt: 99 }, MOVIE_IDS)).toEqual({ trakt: 99 });
    });

    it('should return null when no ids match', () => {
      expect(pickIds({}, MOVIE_IDS)).toBeNull();
    });
  });

  describe('with SHOW_IDS priority', () => {
    it('should return imdb first when available', () => {
      expect(pickIds({ imdb: 'tt9876543', tvdb: 5, trakt: 6 }, SHOW_IDS))
        .toEqual({ imdb: 'tt9876543' });
    });

    it('should fall back to tvdb when imdb is absent', () => {
      expect(pickIds({ tvdb: 123 }, SHOW_IDS)).toEqual({ tvdb: 123 });
    });
  });

  describe('with EPISODE_IDS priority', () => {
    it('should return tvdb first when available', () => {
      expect(pickIds({ tvdb: 77, trakt: 88 }, EPISODE_IDS)).toEqual({
        tvdb: 77,
      });
    });

    it('should fall back to trakt when tvdb is absent', () => {
      expect(pickIds({ trakt: 88 }, EPISODE_IDS)).toEqual({ trakt: 88 });
    });

    it('should return null when only imdb is present (not in episode priority)', () => {
      expect(pickIds({ imdb: 'tt0000000' }, EPISODE_IDS)).toBeNull();
    });
  });
});
