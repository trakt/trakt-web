import { IS_DEV, IS_PREVIEW } from '$lib/utils/env/index.ts';
import { Environment, traktApi } from '@trakt/api';

export const api = traktApi({
  apiKey: TRAKT_CLIENT_ID,
  environment: (() => {
    if (IS_DEV) {
      return Environment.svelte_dev;
    }

    if (IS_PREVIEW) {
      return Environment.svelte_preview;
    }

    return Environment.production;
  })(),
});
