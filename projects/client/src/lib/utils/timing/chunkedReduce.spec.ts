import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chunkedReduce } from './chunkedReduce.ts';

describe('util: chunkedReduce', () => {
  it('should reduce an iterable to a single value', async () => {
    const result = await chunkedReduce([1, 2, 3, 4, 5], (acc, n) => acc + n, 0);
    expect(result).toBe(15);
  });

  it('should return the initial value for an empty iterable', async () => {
    const result = await chunkedReduce([], (_acc: number, _n: number) => _acc + _n, 42);
    expect(result).toBe(42);
  });

  it('should work with any iterable', async () => {
    const result = await chunkedReduce(new Set([1, 2, 3]), (acc, n) => acc + n, 0);
    expect(result).toBe(6);
  });

  describe('yielding behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('should yield to main thread after each full chunk', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
      const items = Array.from({ length: 10 }, (_, i) => i);

      const promise = chunkedReduce(items, (acc, n) => acc + n, 0, 5);
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe(45);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
    });

    it('should not yield when iterable has fewer items than chunkSize', async () => {
      const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

      await chunkedReduce([1, 2, 3], (acc, n) => acc + n, 0, 100);

      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });

    it('should prefer scheduler.yield over setTimeout when available', async () => {
      const mockYield = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('scheduler', { yield: mockYield });

      const items = Array.from({ length: 5 }, (_, i) => i);
      await chunkedReduce(items, (acc, n) => acc + n, 0, 5);

      expect(mockYield).toHaveBeenCalledTimes(1);
    });
  });
});
