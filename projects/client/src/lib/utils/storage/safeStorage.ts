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

function resolveStorage(getStorage: () => Storage | null): Storage {
  if (!browser) {
    return Noop_storage;
  }

  try {
    return getStorage() ?? Noop_storage;
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
