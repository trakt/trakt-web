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

    it('should fall back to title+year when no ids resolve', () => {
      const item: UniversalImportItem = {
        action: 'watchlist',
        type: 'movie',
        ids: {},
        title: 'Dune',
        year: 2021,
      };

      expect(buildWatchlistPayload([item]).movies).toEqual([
        { title: 'Dune', year: 2021 },
      ]);
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
});
