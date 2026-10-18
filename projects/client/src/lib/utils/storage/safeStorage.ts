import { browser } from '$app/environment';
import { NOOP_FN } from '../constants.ts';

const Noop_storage: Storage = {
  length: 0,
  key: () => null,
  getItem: () => null,
  setItem: NOOP_FN,
  removeItem: NOOP_FN,
  clear: NOOP_FN,
};

function attempt<T>(operation: () => T, fallback: T): T {
  try {
    return operation();
  } catch {
    return fallback;
  }
}

function wrapStorage(storage: Storage): Storage {
  return {
    get length() {
      return attempt(() => storage.length, 0);
    },
    key: (index) => attempt(() => storage.key(index), null),
    getItem: (key) => attempt(() => storage.getItem(key), null),
    setItem: (key, value) =>
      attempt(() => storage.setItem(key, value), undefined),
    removeItem: (key) => attempt(() => storage.removeItem(key), undefined),
    clear: () => attempt(() => storage.clear(), undefined),
  };
}

function resolveStorage(getStorage: () => Storage | null): Storage {
  if (!browser) {
    return Noop_storage;
  }

  try {
    const storage = getStorage();
    return storage ? wrapStorage(storage) : Noop_storage;
  } catch {
    return Noop_storage;
  }
}

export const safeLocalStorage: Storage = resolveStorage(
  () => globalThis.localStorage,
);
export const safeSessionStorage: Storage = resolveStorage(
  () => globalThis.sessionStorage,
);
