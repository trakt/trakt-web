import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { toSyncOutcome } from './toSyncOutcome.ts';

function movie(tmdb: number): UniversalImportItem {
  return { action: 'history', type: 'movie', ids: { tmdb } };
}

function episode(tvdb: number): UniversalImportItem {
  return { action: 'history', type: 'episode', ids: { tvdb } };
}

const EMPTY_NOT_FOUND = {
  movies: [],
  shows: [],
  seasons: [],
  episodes: [],
  people: [],
  users: [],
};

describe('util: toSyncOutcome', () => {
  describe('synced count', () => {
    it('should count added items', () => {
      const outcome = toSyncOutcome({
        items: [movie(1), movie(2)],
        status: 200,
        body: {
          added: { movies: 2, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: EMPTY_NOT_FOUND,
        },
      });

      expect(outcome.synced).toBe(2);
    });

    it('should count updated items as synced', () => {
      const outcome = toSyncOutcome({
        items: [movie(1), episode(2)],
        status: 200,
        body: {
          added: { movies: 1, episodes: 0 },
          updated: { movies: 0, episodes: 1 },
          not_found: EMPTY_NOT_FOUND,
        },
      });

      expect(outcome.synced).toBe(2);
    });

    it('should count already-present watchlist items as synced', () => {
      const outcome = toSyncOutcome({
        items: [movie(1), movie(2)],
        status: 200,
        body: {
          added: { movies: 1, shows: 0, seasons: 0, episodes: 0 },
          existing: { movies: 1, shows: 0, seasons: 0, episodes: 0 },
          not_found: EMPTY_NOT_FOUND,
        },
      });

      expect(outcome.synced).toBe(2);
    });

    it('should report nothing synced for a ratings response with no adds', () => {
      const outcome = toSyncOutcome({
        items: [movie(1)],
        status: 200,
        body: {
          added: { movies: 0, shows: 0, seasons: 0, episodes: 0 },
          not_found: { ...EMPTY_NOT_FOUND, movies: [{ ids: { tmdb: 1 } }] },
        },
      });

      expect(outcome.synced).toBe(0);
    });
  });

  describe('rejected items', () => {
    it('should match not_found movies back to the items sent', () => {
      const rejectedMovie = movie(1984483);

      const outcome = toSyncOutcome({
        items: [rejectedMovie, movie(550)],
        status: 200,
        body: {
          added: { movies: 1, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            movies: [{ ids: { tmdb: 1984483 } }],
          },
        },
      });

      expect(outcome.rejected).toEqual([rejectedMovie]);
    });

    it('should match not_found episodes back to the items sent', () => {
      const rejectedEpisode = episode(3485337);

      const outcome = toSyncOutcome({
        items: [rejectedEpisode, episode(999)],
        status: 200,
        body: {
          added: { movies: 0, episodes: 1 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            episodes: [{ ids: { tvdb: 3485337 } }],
          },
        },
      });

      expect(outcome.rejected).toEqual([rejectedEpisode]);
    });

    it('should reject every episode folded into a not_found show', () => {
      const first: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: {},
        showTvdb: 121361,
        season: 1,
        episode: 1,
      };
      const second = { ...first, episode: 2 };

      const outcome = toSyncOutcome({
        items: [first, second],
        status: 200,
        body: {
          added: { movies: 0, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            shows: [{ ids: { tvdb: 121361 } }],
          },
        },
      });

      expect(outcome.rejected).toEqual([first, second]);
    });

    it('should match a not_found show sent by title and year', () => {
      const show: UniversalImportItem = {
        action: 'history',
        type: 'show',
        ids: {},
        title: 'unknown show',
        year: 2008,
      };

      const outcome = toSyncOutcome({
        items: [show],
        status: 200,
        body: {
          added: { movies: 0, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            shows: [{ title: 'unknown show', year: 2008 }],
          },
        },
      });

      expect(outcome.rejected).toEqual([show]);
    });

    it('should not match a same-titled show from another year', () => {
      const show: UniversalImportItem = {
        action: 'history',
        type: 'show',
        ids: {},
        title: 'the office',
        year: 2005,
      };

      const outcome = toSyncOutcome({
        items: [show],
        status: 200,
        body: {
          added: { movies: 0, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            shows: [{ title: 'the office', year: 2001 }],
          },
        },
      });

      expect(outcome.rejected).toEqual([]);
    });

    it('should report no rejects when not_found is empty', () => {
      const outcome = toSyncOutcome({
        items: [movie(550)],
        status: 200,
        body: {
          added: { movies: 1, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: EMPTY_NOT_FOUND,
        },
      });

      expect(outcome.rejected).toEqual([]);
    });

    it('should not double-report an item matching two buckets', () => {
      const item: UniversalImportItem = {
        action: 'history',
        type: 'episode',
        ids: { tvdb: 55 },
        showTvdb: 55,
        season: 1,
        episode: 1,
      };

      const outcome = toSyncOutcome({
        items: [item],
        status: 200,
        body: {
          added: { movies: 0, episodes: 0 },
          updated: { movies: 0, episodes: 0 },
          not_found: {
            ...EMPTY_NOT_FOUND,
            shows: [{ ids: { tvdb: 55 } }],
            episodes: [{ ids: { tvdb: 55 } }],
          },
        },
      });

      expect(outcome.rejected).toEqual([item]);
    });
  });

  describe('refused requests', () => {
    it('should reject the whole chunk on a non-2xx status', () => {
      const items = [movie(1), movie(2)];

      const outcome = toSyncOutcome({ items, status: 420, body: {} });

      expect(outcome).toEqual({ synced: 0, rejected: items });
    });

    it('should report nothing synced for an unreadable body', () => {
      const outcome = toSyncOutcome({
        items: [movie(1)],
        status: 200,
        body: undefined,
      });

      expect(outcome).toEqual({ synced: 0, rejected: [] });
    });
  });
});
