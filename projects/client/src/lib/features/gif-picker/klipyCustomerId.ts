import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

const STORAGE_KEY = 'trakt-klipy-customer-id';

// Storage silently no-ops when disabled, so the id has to survive in memory too.
let cached: string | undefined;

function createId(): string {
  // `crypto.randomUUID` throws in non-secure contexts (plain HTTP).
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** An opaque per-device id, so Klipy can personalise without a Trakt identity. */
export function klipyCustomerId(): string {
  if (cached) {
    return cached;
  }

  const stored = safeLocalStorage.getItem(STORAGE_KEY);

  if (stored) {
    cached = stored;
    return stored;
  }

  const created = createId();
  safeLocalStorage.setItem(STORAGE_KEY, created);
  cached = created;

  return created;
}
