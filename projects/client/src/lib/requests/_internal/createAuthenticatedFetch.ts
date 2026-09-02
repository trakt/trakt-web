import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';
import { isFatalRenewError } from '$lib/features/auth/isFatalRenewError.ts';
import { renewAccessToken } from '$lib/features/auth/renewAccessToken.ts';
import { getUserManager } from '../../features/auth/stores/userManager.ts';
import { IS_DEV } from '../../utils/env/index.ts';

// `useUser` fans out ~15 authorized queries at once, so a lapsed token 401s
// every one of them. Share one attempt across the burst.
let inflightRenewal: Promise<string | null> | null = null;

function renewSession(rejectedToken: string): Promise<string | null> {
  const manager = getUserManager();

  if (!manager) {
    return Promise.resolve(null);
  }

  inflightRenewal ??= renewAccessToken(manager, rejectedToken)
    .then((user) => user?.access_token ?? null)
    .catch((reason) => {
      // Only a refused grant means the session is gone. Offline, timeout, 5xx
      // and rate limits leave the refresh token spendable, so the 401 goes back
      // to the caller with the session intact.
      if (isFatalRenewError(reason)) {
        void manager.removeUser();
      }

      error('Failed to renew the session:', reason);
      return null;
    })
    .finally(() => {
      inflightRenewal = null;
    });

  return inflightRenewal;
}

export function createAuthenticatedFetch<
  T extends typeof fetch,
>(baseFetch: T): T {
  return (function authenticatedFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    const send = (token: string | Nil) => {
      const headers = new Headers(init?.headers || {});

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return baseFetch(
        input,
        {
          ...init,
          headers,
        } as Parameters<T>[1],
      );
    };

    try {
      const { value: token } = getToken();

      return send(token).then((response) => {
        /**
         * FIXME: @seferturan these should return 403 not 401
         * talk to @rudf0rd about this
         */
        if (IS_DEV || response.status !== 401 || !token) {
          return response;
        }

        return renewSession(token).then((renewed) =>
          renewed == null || renewed === token ? response : send(renewed)
        );
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
