import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { toUnsyncableItems } from './toUnsyncableItems.ts';

describe('util: toUnsyncableItems', () => {
  it('should skip an episode carrying only a tmdb id', () => {
    // Trakt accepts trakt or tvdb ids for episodes, never tmdb, and this entry
    // has no season/number to fall back on.
    const item: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: { tmdb: 3485337 },
      watched_at: '2022-07-31T23:57:00.000Z',
    };

    expect(toUnsyncableItems([item])).toEqual([item]);
  });

  it('should keep an episode carrying a tvdb id', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: { tvdb: 3485337 },
    };

    expect(toUnsyncableItems([item])).toEqual([]);
  });

  it('should keep an episode resolvable by show and position', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: {},
      showTvdb: 121361,
      season: 1,
      episode: 1,
    };

    expect(toUnsyncableItems([item])).toEqual([]);
  });

  it('should skip a movie with no usable id', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'movie',
      ids: {},
      title: 'unmatched movie',
    };

    expect(toUnsyncableItems([item])).toEqual([item]);
  });

  it('should keep a movie carrying a tmdb id', () => {
    const item: UniversalImportItem = {
      action: 'history',
      type: 'movie',
      ids: { tmdb: 550 },
    };

    expect(toUnsyncableItems([item])).toEqual([]);
  });

  it('should keep a show matched by title and year', () => {
    const item: UniversalImportItem = {
      action: 'watchlist',
      type: 'show',
      ids: {},
      title: 'breaking bad',
      year: 2008,
    };

    expect(toUnsyncableItems([item])).toEqual([]);
  });

  it('should skip an episode rating', () => {
    // Ratings payloads only carry movies and shows.
    const item: UniversalImportItem = {
      action: 'ratings',
      type: 'episode',
      ids: { tvdb: 3485337 },
      rating: 8,
    };

    expect(toUnsyncableItems([item])).toEqual([item]);
  });

  it('should skip a rating with no score', () => {
    const item: UniversalImportItem = {
      action: 'ratings',
      type: 'movie',
      ids: { tmdb: 550 },
    };

    expect(toUnsyncableItems([item])).toEqual([item]);
  });

  it('should skip an episode on the watchlist', () => {
    const item: UniversalImportItem = {
      action: 'watchlist',
      type: 'episode',
      ids: { tvdb: 3485337 },
    };

    expect(toUnsyncableItems([item])).toEqual([item]);
  });

  it('should return only the items that cannot be sent', () => {
    const sendable: UniversalImportItem = {
      action: 'history',
      type: 'movie',
      ids: { tmdb: 550 },
    };
    const skipped: UniversalImportItem = {
      action: 'history',
      type: 'episode',
      ids: { tmdb: 3485337 },
    };

    expect(toUnsyncableItems([sendable, skipped])).toEqual([skipped]);
  });
});
