import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { orderArray } from './orderArray.ts';

describe('orderArray', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should return empty array when input is empty', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [] });
      const expected = 'a|';
      const result$ = source$.pipe(orderArray((item: number) => item));

      expectObservable(result$).toBe(expected, { a: [] });
    });
  });

  it('should maintain original order when no order specified', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [1, 2, 3] });
      const expected = 'a|';
      const result$ = source$.pipe(orderArray((item: number) => item));

      expectObservable(result$).toBe(expected, { a: [1, 2, 3] });
    });
  });

  it('should order items according to provided order', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [1, 2, 3] });
      const expected = 'a|';
      const result$ = source$.pipe(
        orderArray((item: number) => item, [3, 1, 2]),
      );

      expectObservable(result$).toBe(expected, { a: [3, 1, 2] });
    });
  });

  it('should append items not in order at the end', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a|', { a: [1, 2, 3, 4] });
      const expected = 'a|';
      const result$ = source$.pipe(orderArray((item: number) => item, [1, 2]));

      expectObservable(result$).toBe(expected, { a: [1, 2, 3, 4] });
    });
  });

  it('should work with complex objects', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const items = [
        { id: 1, value: 'one' },
        { id: 2, value: 'two' },
      ];
      const source$ = cold('a|', { a: items });
      const expected = 'a|';
      const result$ = source$.pipe(
        orderArray((item) => item.id, [2, 1]),
      );

      expectObservable(result$).toBe(expected, {
        a: [
          { id: 2, value: 'two' },
          { id: 1, value: 'one' },
        ],
      });
    });
  });

  it('should handle multiple emissions', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('a-b-c|', {
        a: [1, 2, 3],
        b: [4, 5, 6],
        c: [1, 3, 5],
      });
      const expected = 'a-b-c|';
      const result$ = source$.pipe(
        orderArray((item: number) => item, [3, 2, 1]),
      );

      expectObservable(result$).toBe(expected, {
        a: [3, 2, 1],
        b: [4, 5, 6],
        c: [3, 1, 5],
      });
    });
  });
});
