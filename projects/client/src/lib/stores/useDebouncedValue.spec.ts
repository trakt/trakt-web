// get removed - use .value or firstValueFrom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue.ts';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should set initial value immediately', () => {
    const store = useDebouncedValue<number>(100);
    store.next(5);
    expect(store.value).toBe(5);
  });

  it('should debounce subsequent value updates', () => {
    const store = useDebouncedValue<number>(100);
    store.next(1);
    store.next(2);
    store.next(3);

    expect(store.value).toBe(1);

    vi.advanceTimersByTime(100);
    expect(store.value).toBe(3);
  });

  it('should handle update function correctly', () => {
    const store = useDebouncedValue<number>(100);
    store.next(1);
    store.update((val) => (val as number) + 1);

    expect(store.value).toBe(1);

    vi.advanceTimersByTime(100);
    expect(store.value).toBe(2);
  });

  it('should handle null values', () => {
    const store = useDebouncedValue<string>(100);
    store.next(null);
    expect(store.value).toBe(null);

    store.next('test');
    expect(store.value).toBe('test');

    store.next(null);
    vi.advanceTimersByTime(100);
    expect(store.value).toBe(null);
  });
});
