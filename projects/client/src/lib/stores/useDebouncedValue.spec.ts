import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue.ts';

// FIXME: mock debounceTime(delay)
describe.skip('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should emit initial value as null', () => {
    const store = useDebouncedValue<number>(100);
    let emitted: number | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });
    expect(emitted).toBe(null);
  });

  it('should set value and emit after debounce', async () => {
    const store = useDebouncedValue<number>(100);
    let emitted: number | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });

    store.set(5);
    expect(emitted).toBe(null);

    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(5);
  });

  it('should debounce rapid updates and emit only last value', async () => {
    const store = useDebouncedValue<number>(100);
    let emitted: number | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });

    store.set(1);
    store.set(2);
    store.set(3);

    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(3);
  });

  it('should handle update function correctly', async () => {
    const store = useDebouncedValue<number>(100);
    let emitted: number | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });

    store.set(1);
    store.update((val) => (val as number) + 1);

    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(2);
  });

  it('should handle null values', async () => {
    const store = useDebouncedValue<string>(100);
    let emitted: string | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });

    store.set(null);
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(null);

    store.set('test');
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe('test');

    store.set(null);
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(null);
  });

  it('should allow multiple subscribers', async () => {
    const store = useDebouncedValue<number>(50);
    let valueA: number | Nil = null;
    let valueB: number | Nil = null;

    store.subscribe((v) => {
      valueA = v;
    });
    store.subscribe((v) => {
      valueB = v;
    });

    store.set(42);
    vi.advanceTimersByTime(50);
    await Promise.resolve();
    expect(valueA).toBe(42);
    expect(valueB).toBe(42);
  });

  it('should not emit if value does not change', async () => {
    const store = useDebouncedValue<number>(100);
    let count = 0;
    store.subscribe(() => {
      count++;
    });

    store.set(1);
    vi.advanceTimersByTime(100);
    await Promise.resolve();
    store.set(1);
    vi.advanceTimersByTime(100);
    await Promise.resolve();

    expect(count).toBe(2);
  });

  it('should support rapid set and update calls', async () => {
    const store = useDebouncedValue<number>(100);
    let emitted: number | Nil = null;
    store.subscribe((v) => {
      emitted = v;
    });

    store.set(10);
    store.update((v) => (v as number) * 2);
    store.set(50);

    vi.advanceTimersByTime(100);
    await Promise.resolve();
    expect(emitted).toBe(50);
  });
});
