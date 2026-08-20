import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { buildWatchlistPayload } from './buildWatchlistPayload.ts';

describe('buildWatchlistPayload', () => {
  describe('movies', () => {
    it('should add a movie by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'movie',
        ids: { imdb: 'tt1234567' },
      };

      const result = buildWatchlistPayload([item]);

      expect(result.movies).toEqual([{ ids: { imdb: 'tt1234567' } }]);
      expect(result.shows).toHaveLength(0);
    });

    it('should skip an unresolved movie instead of sending title+year', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'movie',
        ids: {},
        title: 'Dune',
        year: 2021,
      };

      expect(buildWatchlistPayload([item]).movies).toHaveLength(0);
    });

    it('should skip a movie with no ids and no title/year', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'movie',
        ids: {},
      };

      expect(buildWatchlistPayload([item]).movies).toHaveLength(0);
    });
  });

  describe('shows', () => {
    it('should add a show by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'show',
        ids: { tvdb: 81189 },
      };

      const result = buildWatchlistPayload([item]);

      expect(result.shows).toEqual([{ ids: { tvdb: 81189 } }]);
      expect(result.movies).toHaveLength(0);
    });

    it('should fall back to title+year when no ids resolve', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'show',
        ids: {},
        title: 'Severance',
        year: 2022,
      };

      expect(buildWatchlistPayload([item]).shows).toEqual([
        { title: 'Severance', year: 2022 },
      ]);
    });
  });

  it('should ignore episode-type items', () => {
    const item: UniversalImportItem = {
      action: 'watchlist',
      type: 'episode',
      ids: { tvdb: 999 },
    };

    const result = buildWatchlistPayload([item]);

    expect(result.movies).toHaveLength(0);
    expect(result.shows).toHaveLength(0);
  });

  describe('seasons', () => {
    it('should map a season item into the seasons bucket', () => {
      const result = buildWatchlistPayload([{
        action: 'watchlist',
        type: 'season',
        ids: { tvdb: 12345 },
      }]);

      expect(result.seasons).toEqual([{ ids: { tvdb: 12345 } }]);
      expect(result.shows).toEqual([]);
    });

    it('should drop a season carrying only an imdb id', () => {
      const result = buildWatchlistPayload([{
        action: 'watchlist',
        type: 'season',
        ids: { imdb: 'tt0306414' },
      }]);

      expect(result.seasons).toEqual([]);
    });
  });

  describe('episodes', () => {
    it('should map an episode item into the episodes bucket', () => {
      const result = buildWatchlistPayload([{
        action: 'watchlist',
        type: 'episode',
        ids: { tvdb: 7654321 },
      }]);

      expect(result.episodes).toEqual([{ ids: { tvdb: 7654321 } }]);
      expect(result.shows).toEqual([]);
    });

    it('should resolve an episode by tmdb id', () => {
      const result = buildWatchlistPayload([{
        action: 'watchlist',
        type: 'episode',
        ids: { tmdb: 66452 },
      }]);

      expect(result.episodes).toEqual([{ ids: { tmdb: 66452 } }]);
    });

    it('should drop an episode carrying only an imdb id', () => {
      const result = buildWatchlistPayload([{
        action: 'watchlist',
        type: 'episode',
        ids: { imdb: 'tt0306414' },
      }]);

      expect(result.episodes).toEqual([]);
    });
  });
});
