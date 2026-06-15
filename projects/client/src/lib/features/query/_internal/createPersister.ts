import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import type { Persister } from '@tanstack/query-persist-client-core';
import { createIdbPersister } from './createIdbPersister.ts';
import { createMemoryPersister } from './createInMemoryPersister.ts';

type PersisterType = 'idb' | 'memory';

export function createPersister(persister: PersisterType): Persister {
  // No-op on SSR and in jsdom-style environments where IndexedDB is missing
  // (idb-keyval throws synchronously on first access). The in-memory variant
  // doesn't need any browser API, so it's safe to instantiate anywhere.
  const idbUnavailable = !browser || typeof indexedDB === 'undefined';
  if (persister === 'idb' && idbUnavailable) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  return persister === 'idb' ? createIdbPersister() : createMemoryPersister();
}
