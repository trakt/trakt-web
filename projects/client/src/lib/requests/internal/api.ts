import { Environment, traktApi } from '@trakt/api';

export const api = traktApi({
  apiKey: TRAKT_CLIENT_ID,
  environment: Environment.svelte_dev,
});
