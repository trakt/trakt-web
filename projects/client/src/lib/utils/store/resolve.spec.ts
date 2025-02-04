import { writable } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { resolve } from './resolve.ts';

describe('resolve', () => {
  it('should resolve the current value of a store', async () => {
    const store = writable(42);
    const result = await resolve(store);
    expect(result).toBe(42);
  });

  it('should resolve updated store values', async () => {
    const store = writable('initial');
    store.set('updated');
    const result = await resolve(store);
    expect(result).toBe('updated');
  });

  it('should work with different data types', async () => {
    const numberStore = writable(123);
    const stringStore = writable('test');
    const objectStore = writable({ key: 'value' });
    const arrayStore = writable([1, 2, 3]);

    expect(await resolve(numberStore)).toBe(123);
    expect(await resolve(stringStore)).toBe('test');
    expect(await resolve(objectStore)).toEqual({ key: 'value' });
    expect(await resolve(arrayStore)).toEqual([1, 2, 3]);
  });

  it('should resolve only when the value is not defined', async () => {
    const store = writable(undefined);

    await expect(resolve(store)).rejects.toThrow();
  });
});
