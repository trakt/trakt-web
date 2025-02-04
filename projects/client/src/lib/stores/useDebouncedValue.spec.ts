import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue.ts';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should set initial value immediately', () => {
    const store = useDebouncedValue<number>(100);
    store.set(5);
    expect(get(store)).toBe(5);
  });

  it('should debounce subsequent value updates', () => {
    const store = useDebouncedValue<number>(100);
    store.set(1);
    store.set(2);
    store.set(3);

    expect(get(store)).toBe(1);

    vi.advanceTimersByTime(100);
    expect(get(store)).toBe(3);
  });

  it('should handle update function correctly', () => {
    const store = useDebouncedValue<number>(100);
    store.set(1);
    store.update((val) => (val as number) + 1);

    expect(get(store)).toBe(1);

    vi.advanceTimersByTime(100);
    expect(get(store)).toBe(2);
  });

  it('should handle null values', () => {
    const store = useDebouncedValue<string>(100);
    store.set(null);
    expect(get(store)).toBe(null);

    store.set('test');
    expect(get(store)).toBe('test');

    store.set(null);
    vi.advanceTimersByTime(100);
    expect(get(store)).toBe(null);
  });
});
