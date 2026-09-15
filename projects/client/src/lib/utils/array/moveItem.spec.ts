import { describe, expect, it } from 'vitest';
import { moveItem } from './moveItem.ts';

const items = ['a', 'b', 'c', 'd'];

describe('util: moveItem', () => {
  it('should move an entry forward', () => {
    expect(moveItem({ items, from: 0, to: 2 })).toEqual(['b', 'c', 'a', 'd']);
  });

  it('should move an entry backward', () => {
    expect(moveItem({ items, from: 3, to: 0 })).toEqual(['d', 'a', 'b', 'c']);
  });

  it('should leave the order alone when it does not move', () => {
    expect(moveItem({ items, from: 1, to: 1 })).toEqual(items);
  });

  it('should settle at the nearest end when dropped past the row', () => {
    expect(moveItem({ items, from: 0, to: 99 })).toEqual(['b', 'c', 'd', 'a']);
    expect(moveItem({ items, from: 3, to: -5 })).toEqual(['d', 'a', 'b', 'c']);
  });

  it('should never drop an entry', () => {
    expect(moveItem({ items, from: 99, to: 0 })).toHaveLength(items.length);
  });

  it('should handle an empty row', () => {
    expect(moveItem({ items: [], from: 0, to: 1 })).toEqual([]);
  });
});
