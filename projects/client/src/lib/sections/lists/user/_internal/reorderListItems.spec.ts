import { describe, expect, it } from 'vitest';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';
import {
  itemOrderSignature,
  listItemRankIds,
  sortReorderableItems,
} from './reorderListItems.ts';

const items: ReorderableListItem[] = [
  {
    key: 'show-2',
    listItemId: 202,
    rank: 2,
    title: 'Second',
  },
  {
    key: 'movie-1',
    listItemId: 101,
    rank: 1,
    title: 'First',
  },
  {
    key: 'episode-3',
    listItemId: 303,
    rank: 3,
    title: 'Third',
  },
];

describe('reorderListItems', () => {
  it('should sort reorderable items by rank', () => {
    const result = sortReorderableItems(items);

    expect(itemOrderSignature(result)).toBe('movie-1|show-2|episode-3');
  });

  it('should build list item rank ids in the current order', () => {
    const result = listItemRankIds(items);

    expect(result).toEqual([202, 101, 303]);
  });
});
