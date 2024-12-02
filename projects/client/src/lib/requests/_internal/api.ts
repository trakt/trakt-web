import { IS_DEV, IS_PREVIEW } from '$lib/utils/env/index.ts';
import { Environment, traktApi, type TraktApiOptions } from '@trakt/api';

const environment = (() => {
  if (IS_DEV) {
    return Environment.svelte_dev;
  }

  if (IS_PREVIEW) {
    return Environment.svelte_preview;
  }

  return Environment.production;
})();

export type ApiParams = Omit<TraktApiOptions, 'apiKey' | 'environment'>;

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
