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

// `idb-keyval`'s lazy open throws synchronously, so a chained `.catch()` never
// attaches.
export async function readAuthMarker(): Promise<boolean> {
  const current = getStore();
  if (!current) {
    return false;
  }

  try {
    return await get<boolean>(MARKER_KEY, current) ?? false;
  } catch {
    return false;
  }
}

export async function writeAuthMarker(isAuthorized: boolean): Promise<void> {
  const current = getStore();
  if (!current) {
    return;
  }

  try {
    await set(MARKER_KEY, isAuthorized, current);
  } catch {
    // SecurityError: storage is blocked.
  }
}
