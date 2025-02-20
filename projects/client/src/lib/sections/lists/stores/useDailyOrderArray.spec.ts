import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDailyOrderArray } from './useDailyOrderArray.ts';

// Mock $app/environment browser value
vi.mock('$app/environment', () => ({
  browser: true,
}));

const item1 = { id: 1, title: 'Item 1' };
const item2 = { id: 2, title: 'Item 2' };
const item3 = { id: 3, title: 'Item 3' };

describe('useDailyOrderArray', () => {
  let TODAY: string;
  let YESTERDAY: string;

  beforeEach(() => {
    // Set a fixed date at midnight UTC
    vi.useFakeTimers();
    const date = new Date('2024-02-21T00:00:00Z');
    vi.setSystemTime(date);

    // Get the start of today and yesterday in local timezone
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    TODAY = today.getTime().toString();
    YESTERDAY = yesterday.getTime().toString();
  });

  it('should return an empty array initially', () => {
    const { list } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    expect(get(list)).toEqual([]);
  });

  it('should save order on first update', () => {
    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2]);

    expect(get(list)).toEqual([item1, item2]);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test',
      JSON.stringify({ [TODAY]: [1, 2] }),
    );
  });

  it('should maintain order from earlier in the day', () => {
    // Simulate previous save
    localStorage.setItem(
      'test',
      JSON.stringify({ [TODAY]: [2, 1] }),
    );

    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2]);

    expect(get(list)).toEqual([item2, item1]);
  });

  it('should append new items to the end', () => {
    localStorage.setItem(
      'test',
      JSON.stringify({ [TODAY]: [2, 1] }),
    );

    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2, item3]);

    expect(get(list)).toEqual([item2, item1, item3]);
  });

  it('should handle removed items', () => {
    localStorage.setItem(
      'test',
      JSON.stringify({ [TODAY]: [3, 2, 1] }),
    );

    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2]);

    expect(get(list)).toEqual([item2, item1]);
  });

  it('should reset order for a new day', () => {
    localStorage.setItem(
      'test',
      JSON.stringify({ [YESTERDAY]: [2, 1] }),
    );

    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2]);

    expect(get(list)).toEqual([item1, item2]);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test',
      JSON.stringify({
        [YESTERDAY]: [2, 1],
        [TODAY]: [1, 2],
      }),
    );
  });

  it('should handle empty updates', () => {
    const { list, set } = useDailyOrderArray({
      key: 'test',
      getId: (item) => item.id,
    });

    set([]);

    expect(get(list)).toEqual([]);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
