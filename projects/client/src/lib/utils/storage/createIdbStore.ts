import type { UseStore } from 'idb-keyval';

function toDatabase(request: IDBOpenDBRequest): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const db = request.result as IDBDatabase | null | undefined;
      return db ? resolve(db) : reject(new Error('IndexedDB unavailable'));
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
}

function ensureObjectStore(request: IDBOpenDBRequest, storeName: string) {
  const db = request.result as IDBDatabase | null | undefined;
  if (!db) return;
  if (db.objectStoreNames.contains(storeName)) return;

  db.createObjectStore(storeName);
}

export function createIdbStore(dbName: string, storeName: string): UseStore {
  let pending: Promise<IDBDatabase> | undefined;

  const getDatabase = () => {
    if (pending) return pending;

    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => ensureObjectStore(request, storeName);

    const opened = toDatabase(request);
    pending = opened;
    opened.then(
      (db) => {
        db.onclose = () => (pending = undefined);
      },
      () => (pending = undefined),
    );

    return opened;
  };

  return (txMode, callback) =>
    getDatabase().then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName))
    );
}
