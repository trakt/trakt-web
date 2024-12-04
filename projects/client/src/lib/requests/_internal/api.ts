import { IS_DEV, IS_PREVIEW } from '$lib/utils/env/index.ts';
import { traktApi, type TraktApiOptions } from '@trakt/api';

export type ApiParams = Omit<TraktApiOptions, 'apiKey' | 'environment'>;

enum ClientEnvironment {
  svelte_dev = 'http://localhost:5173/api',
  svelte_preview = 'http://localhost:4173/api',
}

const environment = (() => {
  if (IS_DEV) {
    return ClientEnvironment.svelte_dev;
  }

  if (IS_PREVIEW) {
    return ClientEnvironment.svelte_preview;
  }

  return TRAKT_TARGET_ENVIRONMENT;
})();

export const api = ({
  fetch = globalThis.fetch,
  cancellable = false,
}: ApiParams = {}) =>
  traktApi({
    apiKey: TRAKT_CLIENT_ID,
    environment,
    fetch,
    cancellable,
  });
