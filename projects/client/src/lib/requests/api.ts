import { createAuthenticatedFetch } from '$lib/requests/_internal/createAuthenticatedFetch.ts';
import { ClientEnvironment } from '$lib/requests/ClientEnvironment.ts';
import { IS_DEV, IS_PREVIEW, IS_TEST } from '$lib/utils/env/index.ts';
import { traktApi, type TraktApiOptions } from '@trakt/api';

type RawApiFetchParams = {
  environment?: HttpsUrl;
  fetch?: typeof fetch;
  path: string;
};

export type ApiParams = Omit<TraktApiOptions, 'apiKey' | 'environment'> & {
  environment?: HttpsUrl;
};

const ENV = (() => {
  if (IS_DEV || IS_PREVIEW) {
    return ClientEnvironment.development as unknown as HttpsUrl;
  }

  if (IS_TEST) {
    return ClientEnvironment.test as unknown as HttpsUrl;
  }

  return TRAKT_TARGET_ENVIRONMENT as unknown as HttpsUrl;
})();

export const api = ({
  environment = ENV,
  fetch = globalThis.fetch,
  cancellable = false,
  cancellationId,
}: ApiParams = {}) =>
  traktApi({
    apiKey: TRAKT_CLIENT_ID,
    environment,
    fetch: createAuthenticatedFetch(fetch),
    cancellable,
    cancellationId,
  });

export const unauthorizedApi = ({
  environment = ENV,
  fetch = globalThis.fetch,
}: ApiParams = {}) =>
  traktApi({
    apiKey: TRAKT_CLIENT_ID,
    environment,
    fetch,
  });

export const rawApiFetch = ({
  environment = ENV,
  fetch = globalThis.fetch,
  path,
}: RawApiFetchParams) => {
  const authenticatedFetch = createAuthenticatedFetch(fetch);
  return authenticatedFetch(`${environment}${path}`, {
    headers: {
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_CLIENT_ID,
    },
  });
};
