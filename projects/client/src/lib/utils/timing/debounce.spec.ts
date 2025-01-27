import { beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should execute callback function only once after waiting period', () => {
    let counter = 0;
    const increment = () => {
      counter++;
    };
    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    debouncedIncrement();
    debouncedIncrement();

    expect(counter).toBe(0);

    vi.advanceTimersByTime(100);

    expect(counter).toBe(1);
  });

  it('should pass arguments to the callback function', () => {
    let result = 0;
    const add = (a: number, b: number) => {
      result = a + b;
    };
    const debouncedAdd = debounce(add, 100);

    debouncedAdd(2, 3);

    vi.advanceTimersByTime(100);

    expect(result).toBe(5);
  });

  it('should reset timer on subsequent calls', () => {
    let counter = 0;
    const increment = () => {
      counter++;
    };
    const debouncedIncrement = debounce(increment, 100);

    debouncedIncrement();
    vi.advanceTimersByTime(50);
    debouncedIncrement();
    vi.advanceTimersByTime(50);
    debouncedIncrement();
    vi.advanceTimersByTime(99);

    expect(counter).toBe(0);

    vi.advanceTimersByTime(1);

    expect(counter).toBe(1);
  });

  it('should return a promise that resolves with the result of the callback function', async () => {
    const add = (a: number, b: number) => a + b;
    const debouncedAdd = debounce(add, 100);

    const resultPromise = debouncedAdd(2, 3);
    vi.advanceTimersByTime(100);
    const result = await resultPromise;

    expect(result).toBe(5);
  });
});
