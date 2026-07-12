import { error } from '$lib/utils/console/print.ts';
import { createStore, get, set } from 'idb-keyval';
import { OfflineActionSchema } from '../models/OfflineAction.ts';
import type { OfflineActionsStorage } from './OfflineActionsStorage.ts';

const DB_NAME = 'trakt-offline';
const STORE_NAME = 'action-queue';
const QUEUE_KEY = 'queue';

const handleError = (e: unknown) => {
  error('Offline actions storage error:', e);
};

// Entries round-trip through IDB structured clone. Each entry is validated on
// read so malformed rows from older deploys are dropped instead of breaking
// the queue.
export function createOfflineActionsStorage(): OfflineActionsStorage {
  const store = createStore(DB_NAME, STORE_NAME);

  return {
    read: () =>
      get<unknown[]>(QUEUE_KEY, store)
        .then((stored) =>
          (stored ?? [])
            .map((entry) => OfflineActionSchema.safeParse(entry))
            .filter((result) => result.success)
            .map((result) => result.data)
        )
        .catch((e) => {
          handleError(e);
          return [];
        }),
    write: (actions) => set(QUEUE_KEY, actions, store).catch(handleError),
  };
}
