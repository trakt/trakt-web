import { beforeEach, describe, expect, it, vi } from 'vitest';

const idb = vi.hoisted(() => ({
  createStore: vi.fn(),
  del: vi.fn(),
  entries: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));

vi.mock('idb-keyval', () => idb);

// What a storage-partitioned or locked-down context throws. `createStore` is
// lazy, so this surfaces synchronously out of the idb-keyval call rather than
// as a rejected promise.
const blocked = () => {
  throw new DOMException(
    'IDBFactory.open() called in an invalid security context',
    'SecurityError',
  );
};

async function importPersister() {
  vi.resetModules();
  const { createIdbPersister } = await import('./createIdbPersister.ts');
  return createIdbPersister();
}

const DATA_UPDATED_AT = Date.now();

const persistedQuery = {
  buster: 'v3',
  queryHash: '["movie"]',
  queryKey: ['movie'],
  state: { data: { title: 'Heretic' }, dataUpdatedAt: DATA_UPDATED_AT },
};

describe('util: createIdbPersister', () => {
  beforeEach(() => {
    idb.createStore.mockReturnValue(vi.fn());
    idb.del.mockResolvedValue(undefined);
    idb.entries.mockResolvedValue([]);
    idb.get.mockResolvedValue(undefined);
    idb.set.mockResolvedValue(undefined);
  });

  describe('when storage is blocked', () => {
    it('should sweep as if storage were empty rather than reject', async () => {
      idb.entries.mockImplementation(blocked);

      const persister = await importPersister();

      await expect(persister.persisterGc()).resolves.toBeUndefined();
    });

    it('should retrieve nothing rather than reject', async () => {
      idb.get.mockImplementation(blocked);

      const persister = await importPersister();

      await expect(
        persister.retrieveQuery('["movie"]'),
      ).resolves.toBeUndefined();
    });

    it('should discard a removal rather than reject', async () => {
      idb.entries.mockResolvedValue([
        [`tanstack-query-${persistedQuery.queryHash}`, persistedQuery],
      ]);
      idb.del.mockImplementation(blocked);

      const persister = await importPersister();

      await expect(persister.removeQueries()).resolves.toBeUndefined();
    });
  });

  describe('when storage rejects asynchronously', () => {
    it('should sweep as if storage were empty', async () => {
      idb.entries.mockRejectedValue(new Error('transaction aborted'));

      const persister = await importPersister();

      await expect(persister.persisterGc()).resolves.toBeUndefined();
    });

    it('should retrieve nothing', async () => {
      idb.get.mockRejectedValue(new Error('transaction aborted'));

      const persister = await importPersister();

      await expect(
        persister.retrieveQuery('["movie"]'),
      ).resolves.toBeUndefined();
    });
  });

  describe('when storage is available', () => {
    it('should retrieve a stored query', async () => {
      idb.get.mockResolvedValue(persistedQuery);

      const persister = await importPersister();

      await expect(persister.retrieveQuery('["movie"]')).resolves.toEqual(
        persistedQuery.state.data,
      );
    });

    it('should sweep a busted entry', async () => {
      const key = `tanstack-query-${persistedQuery.queryHash}`;
      idb.entries.mockResolvedValue([[key, {
        ...persistedQuery,
        buster: 'v2',
      }]]);

      const persister = await importPersister();
      await persister.persisterGc();

      expect(idb.del).toHaveBeenCalledWith(key, expect.anything());
    });
  });
});
