import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { buildHistoryPayload } from './buildHistoryPayload.ts';

const watched_at = '2024-01-01T00:00:00.000Z';

describe('buildHistoryPayload', () => {
  describe('movies', () => {
    it('should add a movie by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt1234567' },
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.movies).toEqual([{
        ids: { imdb: 'tt1234567' },
        watched_at,
      }]);
      expect(result.shows).toHaveLength(0);
      expect(result.episodes).toHaveLength(0);
    });

    it('should skip an unresolved movie instead of sending title+year', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'movie',
        ids: {},
        title: 'Inception',
        year: 2010,
        watched_at,
      };

      expect(buildHistoryPayload([item]).movies).toHaveLength(0);
    });

    it('should skip a movie with no ids and no title/year', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'movie',
        ids: {},
        watched_at,
      };

      expect(buildHistoryPayload([item]).movies).toHaveLength(0);
    });
  });

  describe('shows', () => {
    it('should add a show by resolved ids', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'show',
        ids: { tvdb: 81189 },
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.shows).toEqual([{ ids: { tvdb: 81189 }, watched_at }]);
    });

    it('should fall back to title+year when no ids resolve', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'show',
        ids: {},
        title: 'Breaking Bad',
        year: 2008,
        watched_at,
      };

      expect(buildHistoryPayload([item]).shows).toEqual([
        { title: 'Breaking Bad', year: 2008, watched_at },
      ]);
    });
  });

  describe('episodes', () => {
    it('should resolve an episode positionally via show + season + number', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
        showTvdb: 9001,
        season: 2,
        episode: 1,
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.shows).toEqual([{
        ids: { tvdb: 9001 },
        seasons: [{ number: 2, episodes: [{ number: 1, watched_at }] }],
      }]);
      expect(result.episodes).toHaveLength(0);
    });

    it('should resolve positionally via show imdb when the show has no tvdb', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
        showImdb: 'tt1234567',
        season: 1,
        episode: 1,
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.shows).toEqual([{
        ids: { imdb: 'tt1234567' },
        seasons: [{ number: 1, episodes: [{ number: 1, watched_at }] }],
      }]);
      expect(result.episodes).toHaveLength(0);
    });

    it('should merge one show when items carry differing show ids', () => {
      const items: UniversalImportItem[] = [
        {
          action: 'history',
          type: 'episode',
          ids: {},
          showTvdb: 9001,
          season: 1,
          episode: 1,
          watched_at,
        },
        {
          action: 'history',
          type: 'episode',
          ids: {},
          showTvdb: 9001,
          showImdb: 'tt1234567',
          season: 1,
          episode: 2,
          watched_at,
        },
      ];

      const result = buildHistoryPayload(items);

      expect(result.shows).toEqual([{
        ids: { tvdb: 9001, imdb: 'tt1234567' },
        seasons: [{
          number: 1,
          episodes: [
            { number: 1, watched_at },
            { number: 2, watched_at },
          ],
        }],
      }]);
    });

    it('should group positional episodes by show and season', () => {
      const items: UniversalImportItem[] = [
        {
          action: 'history',
          type: 'episode',
          ids: {},
          showTvdb: 9001,
          season: 1,
          episode: 1,
          watched_at,
        },
        {
          action: 'history',
          type: 'episode',
          ids: {},
          showTvdb: 9001,
          season: 1,
          episode: 2,
          watched_at,
        },
        {
          action: 'history',
          type: 'episode',
          ids: {},
          showTvdb: 9001,
          season: 2,
          episode: 1,
          watched_at,
        },
      ];

      const result = buildHistoryPayload(items);

      expect(result.shows).toEqual([{
        ids: { tvdb: 9001 },
        seasons: [
          {
            number: 1,
            episodes: [
              { number: 1, watched_at },
              { number: 2, watched_at },
            ],
          },
          { number: 2, episodes: [{ number: 1, watched_at }] },
        ],
      }]);
      expect(result.episodes).toHaveLength(0);
    });

    it('should prefer positional resolution over the episode id', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: { tvdb: 4321 },
        showTvdb: 9001,
        season: 2,
        episode: 1,
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.shows).toEqual([{
        ids: { tvdb: 9001 },
        seasons: [{ number: 2, episodes: [{ number: 1, watched_at }] }],
      }]);
      expect(result.episodes).toHaveLength(0);
    });

    it('should add an episode by its id when not positionally resolvable', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: { tvdb: 4321 },
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.episodes).toEqual([{ ids: { tvdb: 4321 }, watched_at }]);
      expect(result.shows).toHaveLength(0);
    });

    it('should fall back to show via imdb when no episode ids resolve', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: { imdb: 'tt9999999' },
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.episodes).toHaveLength(0);
      expect(result.shows).toEqual([{
        ids: { imdb: 'tt9999999' },
        watched_at,
      }]);
    });

    it('should skip an episode with no usable ids', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
        watched_at,
      };

      const result = buildHistoryPayload([item]);

      expect(result.episodes).toHaveLength(0);
      expect(result.shows).toHaveLength(0);
    });
  });
});
