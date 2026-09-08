import { beforeEach, describe, expect, it, vi } from 'vitest';

const idb = vi.hoisted(() => ({
  createStore: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}));

vi.mock('idb-keyval', () => idb);

// `indexedDB` only has to exist; `createStore` is mocked, so nothing opens it.
vi.stubGlobal('indexedDB', {});

// What a storage-partitioned or locked-down context throws. `createStore` is
// lazy, so this surfaces synchronously out of `get`/`set` rather than as a
// rejected promise.
const blocked = () => {
  throw new DOMException(
    'IDBFactory.open() called in an invalid security context',
    'SecurityError',
  );
};

async function importAuthMarker() {
  vi.resetModules();
  return await import('./authMarker.ts');
}

describe('util: authMarker', () => {
  beforeEach(() => {
    idb.createStore.mockReturnValue(vi.fn());
  });

  describe('when storage is blocked', () => {
    it('should read as signed out rather than reject', async () => {
      idb.get.mockImplementation(blocked);

      const { readAuthMarker } = await importAuthMarker();

      await expect(readAuthMarker()).resolves.toBe(false);
    });

    it('should discard a write rather than reject', async () => {
      idb.set.mockImplementation(blocked);

      const { writeAuthMarker } = await importAuthMarker();

      await expect(writeAuthMarker(true)).resolves.toBeUndefined();
    });
  });

  describe('when storage rejects asynchronously', () => {
    it('should read as signed out', async () => {
      idb.get.mockRejectedValue(new Error('transaction aborted'));

      const { readAuthMarker } = await importAuthMarker();

      await expect(readAuthMarker()).resolves.toBe(false);
    });

    it('should discard a write', async () => {
      idb.set.mockRejectedValue(new Error('transaction aborted'));

      const { writeAuthMarker } = await importAuthMarker();

      await expect(writeAuthMarker(true)).resolves.toBeUndefined();
    });
  });

  describe('when storage is available', () => {
    it('should read the stored marker', async () => {
      idb.get.mockResolvedValue(true);

      const { readAuthMarker } = await importAuthMarker();

      await expect(readAuthMarker()).resolves.toBe(true);
    });

    it('should read an unset marker as signed out', async () => {
      idb.get.mockResolvedValue(undefined);

      const { readAuthMarker } = await importAuthMarker();

      await expect(readAuthMarker()).resolves.toBe(false);
    });

    it('should write the marker', async () => {
      idb.set.mockResolvedValue(undefined);

      const { writeAuthMarker } = await importAuthMarker();
      await writeAuthMarker(true);

      expect(idb.set).toHaveBeenCalledWith(
        'is-authorized',
        true,
        expect.anything(),
      );
    });
  });
});
