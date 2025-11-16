import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import type { Persister } from '@tanstack/svelte-query-persist-client';
import { createIdbPersister } from './createIdbPersister.ts';

export function createPersister(): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  return createIdbPersister();
}
