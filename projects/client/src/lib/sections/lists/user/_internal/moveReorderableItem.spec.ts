import { describe, expect, it } from 'vitest';
import type { ReorderableListItem } from './models/ReorderableListItem.ts';
import { moveReorderableItem } from './moveReorderableItem.ts';

function createItems(): ReorderableListItem[] {
  return [
    { key: 'a', listItemId: 1, rank: 1, title: 'A' },
    { key: 'b', listItemId: 2, rank: 2, title: 'B' },
    { key: 'c', listItemId: 3, rank: 3, title: 'C' },
    { key: 'd', listItemId: 4, rank: 4, title: 'D' },
  ];
}

function keysOf(items: ReorderableListItem[]) {
  return items.map((item) => item.key);
}

describe('moveReorderableItem', () => {
  it('should move an item down the list', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'a',
      targetIndex: 2,
    });

    expect(keysOf(result)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('should move an item up the list', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'd',
      targetIndex: 1,
    });

    expect(keysOf(result)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('should move an item to the top', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'c',
      targetIndex: 0,
    });

    expect(keysOf(result)).toEqual(['c', 'a', 'b', 'd']);
  });

  it('should move an item to the bottom', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'a',
      targetIndex: 3,
    });

    expect(keysOf(result)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('should keep the order when moving an item onto itself', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'b',
      targetIndex: 1,
    });

    expect(keysOf(result)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should clamp a target index beyond the end to the last position', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'a',
      targetIndex: 999,
    });

    expect(keysOf(result)).toEqual(['b', 'c', 'd', 'a']);
  });

  it('should clamp a negative target index to the first position', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'd',
      targetIndex: -1,
    });

    expect(keysOf(result)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('should clamp a large negative target index to the first position', () => {
    const result = moveReorderableItem({
      items: createItems(),
      key: 'd',
      targetIndex: -5,
    });

    expect(keysOf(result)).toEqual(['d', 'a', 'b', 'c']);
  });

  it('should return the original list when the key is unknown', () => {
    const items = createItems();
    const result = moveReorderableItem({
      items,
      key: 'missing',
      targetIndex: 0,
    });

    expect(result).toBe(items);
  });

  it('should NOT mutate the input list', () => {
    const items = createItems();

    moveReorderableItem({ items, key: 'a', targetIndex: 3 });

    expect(keysOf(items)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should handle a single item list', () => {
    const items: ReorderableListItem[] = [
      { key: 'a', listItemId: 1, rank: 1, title: 'A' },
    ];

    const result = moveReorderableItem({ items, key: 'a', targetIndex: 5 });

    expect(keysOf(result)).toEqual(['a']);
  });
});
