import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dailyOrderArray } from './dailyOrderArray.ts';

// Mock $app/environment browser value
vi.mock('$app/environment', () => ({
  browser: true,
}));

const item1 = { id: 1, title: 'Item 1' };
const item2 = { id: 2, title: 'Item 2' };
const item3 = { id: 3, title: 'Item 3' };
const item4 = { id: 4, title: 'Item 4' };

describe('dailyOrderArray', () => {
  let scheduler: TestScheduler;
  let TODAY: string;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    // Set a fixed date at midnight UTC
    vi.useFakeTimers();
    const date = new Date('2024-02-21T00:00:00Z');
    vi.setSystemTime(date);

    // Get the start of today in local timezone
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    TODAY = today.getTime().toString();

    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should order array using cached order from today', () => {
    localStorage.setItem(
      'test-key',
      JSON.stringify({ [TODAY]: [2, 1] }),
    );

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [item1, item2] });
      const expected = 'a|';
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item) => item.id),
      );

      expectObservable(result$).toBe(expected, { a: [item2, item1] });
    });
  });

  it('should save order to localStorage after processing', () => {
    scheduler.run(({ cold, flush }) => {
      const source$ = cold('a|', { a: [item1, item2] });
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item) => item.id),
      );

      result$.subscribe();
      flush();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ [TODAY]: [1, 2] }),
      );
    });
  });

  it('should append new items to the end', () => {
    localStorage.setItem(
      'test-key',
      JSON.stringify({ [TODAY]: [2, 1] }),
    );

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [item1, item2, item3] });
      const expected = 'a|';
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item) => item.id),
      );

      expectObservable(result$).toBe(expected, { a: [item2, item1, item3] });
    });
  });

  it('should handle removed items', () => {
    localStorage.setItem(
      'test-key',
      JSON.stringify({ [TODAY]: [3, 2, 1] }),
    );

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [item1, item3] });
      const expected = 'a|';
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item) => item.id),
      );

      expectObservable(result$).toBe(expected, { a: [item3, item1] });
    });
  });

  it('should handle multiple emissions over time', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c|', {
        a: [item1, item2],
        b: [item2, item3],
        c: [item1, item2, item3, item4],
      });
      const expected = 'a-b-c|';
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item) => item.id),
      );

      expectObservable(result$).toBe(expected, {
        a: [item1, item2],
        b: [item2, item3],
        c: [item1, item2, item3, item4],
      });
    });
  });

  it('should not save when array is empty', () => {
    scheduler.run(({ cold, flush }) => {
      const source$ = cold('a|', { a: [] });
      const result$ = source$.pipe(
        dailyOrderArray('test-key', (item: { id: number }) => item.id),
      );

      result$.subscribe();
      flush();

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
