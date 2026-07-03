import { describe, expect, it } from 'vitest';
import { filterImportItemsByActionSelection } from './filterImportItemsByActionSelection.ts';
import type { UniversalImportItem } from './ImportTypes.ts';

const items: UniversalImportItem[] = [
  {
    action: 'history',
    type: 'episode',
    ids: { tvdb: 1 },
  },
  {
    action: 'watchlist',
    type: 'show',
    ids: { tvdb: 2 },
  },
  {
    action: 'ratings',
    type: 'movie',
    ids: { trakt: 3 },
    rating: 10,
  },
];

describe('filterImportItemsByActionSelection', () => {
  it('should keep only items whose import action is selected', () => {
    const result = filterImportItemsByActionSelection({
      items,
      selectedActions: {
        history: false,
        watchlist: true,
        ratings: true,
      },
    });

    expect(result.map((item) => item.action)).toEqual([
      'watchlist',
      'ratings',
    ]);
  });

  it('should return an empty array when every import action is skipped', () => {
    const result = filterImportItemsByActionSelection({
      items,
      selectedActions: {
        history: false,
        watchlist: false,
        ratings: false,
      },
    });

    expect(result).toEqual([]);
  });
});
