import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { useOrderedArray } from './useOrderedArray.ts';

describe('useOrderedArray', () => {
  it('should return empty array when input is empty', () => {
    const { list, set } = useOrderedArray({
      getId: (item: number) => item,
    });

    set([]);
    expect(get(list)).toEqual([]);
  });

  it('should maintain original order when no order specified', () => {
    const { list, set } = useOrderedArray({
      getId: (item: number) => item,
    });

    set([1, 2, 3]);
    expect(get(list)).toEqual([1, 2, 3]);
  });

  it('should order items according to initial order', () => {
    const { list, set } = useOrderedArray({
      getId: (item: number) => item,
      order: [3, 1, 2],
    });

    set([1, 2, 3]);
    expect(get(list)).toEqual([3, 1, 2]);
  });

  it('should order items according to new order', () => {
    const { list, set } = useOrderedArray({
      getId: (item: number) => item,
      order: [3, 1, 2],
    });

    set([1, 2, 3], [2, 3, 1]);
    expect(get(list)).toEqual([2, 3, 1]);
  });

  it('should append items not in order at the end', () => {
    const { list, set } = useOrderedArray({
      getId: (item: number) => item,
      order: [1, 2],
    });

    set([1, 2, 3, 4]);
    expect(get(list)).toEqual([1, 2, 3, 4]);
  });

  it('should work with complex objects', () => {
    const { list, set } = useOrderedArray({
      getId: (item: { id: number; value: string }) => item.id,
      order: [2, 1],
    });

    const items = [
      { id: 1, value: 'one' },
      { id: 2, value: 'two' },
    ];

    set(items);
    expect(get(list)).toEqual([
      { id: 2, value: 'two' },
      { id: 1, value: 'one' },
    ]);
  });
});
