import { createAuthenticatedFetch } from '$lib/requests/_internal/createAuthenticatedFetch.ts';
import { ClientEnvironment } from '$lib/requests/ClientEnvironment.ts';
import { IS_DEV, IS_PREVIEW, IS_TEST } from '$lib/utils/env/index.ts';
import { traktApi, type TraktApiOptions } from '@trakt/api';

type RawApiFetchParams = {
  environment?: HttpsUrl;
  fetch?: typeof fetch;
  path: string;
  init?: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };
  // Defaults to true (attach the signed-in user's Bearer token). Pass false for
  // requests authorized out-of-band (e.g. the WebView `slurm` token): no Bearer
  // is sent, so a different account's token can never mix with the request, and
  // a 401 cannot tear down the web session.
  authenticated?: boolean;
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
  init,
  authenticated = true,
}: RawApiFetchParams) => {
  const { headers: additionalHeaders, ...restInit } = init ?? {};
  // Unauthenticated requests use the bare fetch: no Bearer token, and none of
  // the 401 re-authentication side effects that would sign out a web session.
  const baseFetch = authenticated ? createAuthenticatedFetch(fetch) : fetch;
  return baseFetch(`${environment}${path}`, {
    ...restInit,
    headers: {
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_CLIENT_ID,
      ...additionalHeaders,
    },
  });
};
