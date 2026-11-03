import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasIndexedDb } from './hasIndexedDb.ts';

describe('util: hasIndexedDb', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should find a built-in indexeddb', () => {
    vi.stubGlobal('indexedDB', { open: vi.fn() });

    expect(hasIndexedDb()).toBe(true);
  });

  it('should not find an indexeddb that is missing', () => {
    vi.stubGlobal('indexedDB', undefined);

    expect(hasIndexedDb()).toBe(false);
  });

  it('should not find an indexeddb that is null', () => {
    vi.stubGlobal('indexedDB', null);

    expect(hasIndexedDb()).toBe(false);
  });
});
