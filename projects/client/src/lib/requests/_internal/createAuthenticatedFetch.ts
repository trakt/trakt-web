import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';

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
      const { value: token } = getToken();
      const url = input.toString();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);

        const isNitro = url.includes('/sync/progress/up_next_nitro');
        const isApiCall = url.includes('apiz.trakt.tv');
        if (isNitro && isApiCall) {
          input = input.toString().replaceAll('apiz.trakt.tv', 'hd.trakt.tv')
            .toString();
        }
      }

      return baseFetch(
        input,
        {
          ...modifiedInit,
          headers,
        } as Parameters<T>[1],
      ).then((response) => {
        if (response.status === 401 && token) {
          globalThis.window.location.reload();
        }

        return response;
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
