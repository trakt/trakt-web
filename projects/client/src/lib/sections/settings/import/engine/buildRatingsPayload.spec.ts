import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { buildRatingsPayload } from './buildRatingsPayload.ts';

describe('buildRatingsPayload', () => {
  describe('movies', () => {
    it('should add a rated movie by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt1234567' },
        rating: 8,
      };

      const result = buildRatingsPayload([item]);

      expect(result.movies).toEqual([{ rating: 8, ids: { imdb: 'tt1234567' } }]);
      expect(result.shows).toHaveLength(0);
    });

    it('should skip a movie with no resolvable ids', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: {},
        rating: 7,
      };

      expect(buildRatingsPayload([item]).movies).toHaveLength(0);
    });

    it('should skip a movie with no rating', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt1234567' },
      };

      expect(buildRatingsPayload([item]).movies).toHaveLength(0);
    });
  });

  describe('shows', () => {
    it('should add a rated show by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'show',
        ids: { tvdb: 81189 },
        rating: 10,
      };

      const result = buildRatingsPayload([item]);

      expect(result.shows).toEqual([{ rating: 10, ids: { tvdb: 81189 } }]);
      expect(result.movies).toHaveLength(0);
    });
  });

  describe('rating clamping', () => {
    it('should clamp ratings above 10 to 10', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt0000001' },
        rating: 15,
      };

      expect(buildRatingsPayload([item]).movies).toEqual([
        { rating: 10, ids: { imdb: 'tt0000001' } },
      ]);
    });

    it('should clamp ratings below 1 to 1', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt0000002' },
        rating: 0,
      };

      expect(buildRatingsPayload([item]).movies).toEqual([
        { rating: 1, ids: { imdb: 'tt0000002' } },
      ]);
    });

    it('should round fractional ratings', () => {
      const item: UniversalImportItem = {
        action: 'ratings',
        type: 'movie',
        ids: { imdb: 'tt0000003' },
        rating: 7.6,
      };

      expect(buildRatingsPayload([item]).movies).toEqual([
        { rating: 8, ids: { imdb: 'tt0000003' } },
      ]);
    });
  });

  it('should ignore episode-type items', () => {
    const item: UniversalImportItem = {
      action: 'ratings',
      type: 'episode',
      ids: { tvdb: 999 },
      rating: 9,
    };

    const result = buildRatingsPayload([item]);

    expect(result.movies).toHaveLength(0);
    expect(result.shows).toHaveLength(0);
  });
});
