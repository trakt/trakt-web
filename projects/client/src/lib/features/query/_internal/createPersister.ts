import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import type { Persister } from '@tanstack/svelte-query-persist-client';
import type { DeviceType } from '../../../models/DeviceType.ts';
import { createIdbPersister } from './createIdbPersister.ts';
import { createMemoryPersister } from './createMemoryPersister.ts';

export function createPersister(device?: DeviceType): Persister {
  if (!browser) {
    return {
      persistClient: NOOP_FN,
      restoreClient: () => Promise.resolve(undefined),
      removeClient: NOOP_FN,
    };
  }

  if (device === 'tv') {
    return createMemoryPersister();
  }

  return createIdbPersister();
}
