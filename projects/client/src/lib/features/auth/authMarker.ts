import { createStore, get, set, type UseStore } from 'idb-keyval';

const DB_NAME = 'trakt-auth';
const STORE_NAME = 'auth-marker';
const MARKER_KEY = 'is-authorized';

// The service worker needs auth state but cannot read the httpOnly session
// cookie, and `cookieStore` is Chromium-only. IDB is readable from both.
let store: UseStore | undefined;

function getStore(): UseStore | null {
  if (typeof indexedDB === 'undefined') {
    return null;
  }

  try {
    store ??= createStore(DB_NAME, STORE_NAME);
    return store;
  } catch {
    return null;
  }
}

export async function readAuthMarker(): Promise<boolean> {
  const current = getStore();
  if (!current) {
    return false;
  }

  return await get<boolean>(MARKER_KEY, current).catch(() => false) ?? false;
}

export async function writeAuthMarker(isAuthorized: boolean): Promise<void> {
  const current = getStore();
  if (!current) {
    return;
  }

  await set(MARKER_KEY, isAuthorized, current).catch(() => {});
}
