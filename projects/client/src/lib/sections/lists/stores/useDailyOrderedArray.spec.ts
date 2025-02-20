import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDailyOrderedArray } from './useDailyOrderedArray.ts';

// Mock $app/environment browser value
vi.mock('$app/environment', () => ({
  browser: true,
}));

const item1 = { id: 1, title: 'Item 1' };
const item2 = { id: 2, title: 'Item 2' };
const item3 = { id: 3, title: 'Item 3' };
const item4 = { id: 4, title: 'Item 4' };

describe('useDailyOrderedArray', () => {
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

    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return an empty array initially', () => {
    const { list } = useDailyOrderedArray<{ id: number }>({
      key: 'test',
      getId: (item) => item.id,
    });

    expect(get(list)).toEqual([]);
  });

  it('should save order on first update', () => {
    const { list, set } = useDailyOrderedArray<{ id: number }>({
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
    localStorage.setItem(
      'test',
      JSON.stringify({ [TODAY]: [2, 1] }),
    );

    const { list, set } = useDailyOrderedArray<{ id: number }>({
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

    const { list, set } = useDailyOrderedArray<{ id: number }>({
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

    const { list, set } = useDailyOrderedArray<{ id: number }>({
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

    const { list, set } = useDailyOrderedArray<{ id: number }>({
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
    const { list, set } = useDailyOrderedArray<{ id: number }>({
      key: 'test',
      getId: (item) => item.id,
    });

    set([]);

    expect(get(list)).toEqual([]);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should maintain order after multiple updates in same day', () => {
    const { list, set } = useDailyOrderedArray<{ id: number }>({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2, item3]);
    set([item2, item3, item1]); // Reorder
    set([item3, item1, item2]); // Reorder again

    expect(get(list)).toEqual([item1, item2, item3]);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'test',
      JSON.stringify({ [TODAY]: [1, 2, 3] }),
    );
  });

  it('should persist order of newly added items during the day', () => {
    const item5 = { id: 5, title: 'Item 5' };
    const item10 = { id: 10, title: 'Item 10' };

    const { list, set } = useDailyOrderedArray<{ id: number }>({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2, item3]);
    set([item1, item2, item3, item10, item5]);
    set([item1, item2, item3, item5, item10]);

    expect(get(list)).toEqual([item1, item2, item3, item10, item5]);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      'test',
      JSON.stringify({ [TODAY]: [1, 2, 3, 10, 5] }),
    );
  });

  it('should handle multiple days of history', () => {
    const twoDaysAgo = new Date(TODAY);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const TWO_DAYS_AGO = twoDaysAgo.getTime().toString();

    localStorage.setItem(
      'test',
      JSON.stringify({
        [TWO_DAYS_AGO]: [3, 2, 1],
        [YESTERDAY]: [2, 1, 3],
        [TODAY]: [1, 3, 2],
      }),
    );

    const { list, set } = useDailyOrderedArray<{ id: number }>({
      key: 'test',
      getId: (item) => item.id,
    });

    set([item1, item2, item3, item4]);

    expect(get(list)).toEqual([item1, item3, item2, item4]);
  });
});
