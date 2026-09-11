import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

const STORAGE_KEY = 'trakt-klipy-customer-id';

function createId(): string {
  // `crypto.randomUUID` throws in non-secure contexts (plain HTTP), and the id
  // only has to be opaque and stable - not cryptographically random.
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Klipy ranks trending and keeps a recents list per `customer_id`. An opaque
 * per-device id keeps both working without handing them a Trakt identity.
 */
export function klipyCustomerId(): string {
  const stored = safeLocalStorage.getItem(STORAGE_KEY);

  if (stored) {
    return stored;
  }

  const created = createId();
  safeLocalStorage.setItem(STORAGE_KEY, created);

  return created;
}
