import { afterEach, describe, expect, it, vi } from 'vitest';
import { createIdbStore } from './createIdbStore.ts';

type FakeRequest = {
  result: unknown;
  error: Error | null;
  onupgradeneeded?: () => void;
  onsuccess?: () => void;
  onerror?: () => void;
  onblocked?: () => void;
};

function createFakeDatabase(existingStores: string[] = []) {
  const stores = new Set(existingStores);
  const objectStore = { name: 'store' };

  return {
    stores,
    objectStore,
    db: {
      objectStoreNames: { contains: (name: string) => stores.has(name) },
      createObjectStore: vi.fn((name: string) => {
        if (stores.has(name)) throw new Error('ConstraintError');
        stores.add(name);
      }),
      transaction: vi.fn(() => ({ objectStore: () => objectStore })),
      onclose: null as (() => void) | null,
    },
  };
}

function stubOpen(run: (request: FakeRequest) => void) {
  const open = vi.fn(() => {
    const request: FakeRequest = { result: undefined, error: null };
    queueMicrotask(() => run(request));
    return request;
  });
  vi.stubGlobal('indexedDB', { open });
  return open;
}

describe('util: createIdbStore', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create the object store on first open', async () => {
    const fake = createFakeDatabase();
    stubOpen((request) => {
      request.result = fake.db;
      request.onupgradeneeded?.();
      request.onsuccess?.();
    });

    const store = createIdbStore('db', 'items');
    const result = await store('readonly', (objectStore) => objectStore);

    expect(fake.stores.has('items')).toBe(true);
    expect(result).toBe(fake.objectStore);
  });

  it('should not recreate a store that already exists', async () => {
    const fake = createFakeDatabase(['items']);
    stubOpen((request) => {
      request.result = fake.db;
      request.onupgradeneeded?.();
      request.onsuccess?.();
    });

    const store = createIdbStore('db', 'items');

    await expect(store('readonly', () => 'ok')).resolves.toBe('ok');
    expect(fake.db.createObjectStore).not.toHaveBeenCalled();
  });

  it('should reject instead of throwing when the upgrade has no database', async () => {
    stubOpen((request) => {
      request.onupgradeneeded?.();
      request.onsuccess?.();
    });

    const store = createIdbStore('db', 'items');

    await expect(store('readonly', () => 'ok')).rejects.toThrow(
      'IndexedDB unavailable',
    );
  });

  it('should retry opening after a failed open', async () => {
    const fake = createFakeDatabase(['items']);
    const open = stubOpen((request) => {
      if (open.mock.calls.length === 1) {
        request.error = new Error('denied');
        request.onerror?.();
        return;
      }
      request.result = fake.db;
      request.onsuccess?.();
    });

    const store = createIdbStore('db', 'items');

    await expect(store('readonly', () => 'ok')).rejects.toThrow('denied');
    await expect(store('readonly', () => 'ok')).resolves.toBe('ok');
    expect(open).toHaveBeenCalledTimes(2);
  });
});
