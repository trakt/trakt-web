import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';

const RELOAD_STATE_KEY = 'has-reloaded';

function handle401(token: string | Nil) {
  if (!token || sessionStorage.getItem(RELOAD_STATE_KEY)) {
    return;
  }

  sessionStorage.setItem(RELOAD_STATE_KEY, 'true');
  globalThis.window.location.reload();
}

export function createAuthenticatedFetch<
  T extends typeof fetch,
>(baseFetch: T): T {
  return (function authenticatedFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    const modifiedInit = { ...init } as Parameters<T>[1];
    const headers = new Headers(modifiedInit?.headers || {});

    try {
      const token = getToken();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return baseFetch(
        input,
        {
          ...modifiedInit,
          headers,
        } as Parameters<T>[1],
      ).then((response) => {
        if (response.status === 401) {
          handle401(token);
          return Promise.reject(new Error('Unauthorized request'));
        }

        return response;
      }).finally(() => {
        sessionStorage.removeItem(RELOAD_STATE_KEY);
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
