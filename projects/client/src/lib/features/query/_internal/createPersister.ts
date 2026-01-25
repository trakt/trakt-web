import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import type { Persister } from '@tanstack/svelte-query-persist-client';
import { createIdbPersister } from './createIdbPersister.ts';
import { createMemoryPersister } from './createInMemoryPersister.ts';

type PersisterType = 'idb' | 'memory';

export function createPersister(persister: PersisterType): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  return persister === 'idb' ? createIdbPersister() : createMemoryPersister();
}
