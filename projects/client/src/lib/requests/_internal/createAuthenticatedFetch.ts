import { getToken } from '$lib/features/auth/token/index.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';

import { error } from '$lib/utils/console/print.ts';
import { isFatalRenewError } from '$lib/features/auth/isFatalRenewError.ts';
import { renewAccessToken } from '$lib/features/auth/renewAccessToken.ts';
import { getSilentRenewGuard } from '$lib/features/auth/stores/silentRenewGuard.ts';
import { time } from '$lib/utils/timing/time.ts';
import { getUserManager } from '../../features/auth/stores/userManager.ts';
import { IS_DEV } from '../../utils/env/index.ts';

// A 401 is evidence the token is spent, so it cannot sit behind the
// speculative cooldown the timer-driven renewals share. This window only
// collapses the stragglers that 401 just after a renewal already landed.
const RENEW_ON_401_COOLDOWN = time.seconds(5);

async function renewSession(rejectedToken: string): Promise<string | null> {
  const manager = getUserManager();
  const guard = getSilentRenewGuard();

  if (!manager || !guard) {
    return null;
  }

  try {
    const { value } = await guard.renew(
      () => renewAccessToken(manager, rejectedToken),
      { cooldownMs: RENEW_ON_401_COOLDOWN },
    );

    return value?.access_token ?? null;
  } catch (reason) {
    // Only a refused grant means the session is gone. Offline, timeout, 5xx
    // and rate limits leave the refresh token spendable, so the 401 goes back
    // to the caller with the session intact.
    if (isFatalRenewError(reason)) {
      // Best-effort: storage can be unavailable (private mode, blocked),
      // and a failed clear here shouldn't surface as an unhandled rejection.
      manager.removeUser().catch(NOOP_FN);
    }

    error('Failed to renew the session:', reason);
    return null;
  }
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
