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

function wrapStorage(storage: Storage): Storage {
  return {
    get length() {
      return storage.length;
    },
    key: (index) => storage.key(index),
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => {
      try {
        storage.setItem(key, value);
      } catch {
        // QuotaExceededError: storage full or disabled
      }
    },
    removeItem: (key) => storage.removeItem(key),
    clear: () => storage.clear(),
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

export const safeLocalStorage: Storage = resolveStorage(() =>
  globalThis.localStorage
);
export const safeSessionStorage: Storage = resolveStorage(() =>
  globalThis.sessionStorage
);
