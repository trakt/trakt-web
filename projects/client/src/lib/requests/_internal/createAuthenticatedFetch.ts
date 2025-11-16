import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';
import { getMarker } from '../../utils/date/Marker.ts';

export function createAuthenticatedFetch<
  T extends typeof fetch,
>(baseFetch: T): T {
  return (function authenticatedFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    const headers = new Headers(init?.headers || {});

    try {
      const { value: token } = getToken();

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const method = init?.method?.toUpperCase();
      const marker = getMarker();

      if (method === 'GET' && marker != null) {
        const [path, queryString] = input.toString().split('?');
        const params = new URLSearchParams(queryString || '');
        params.set('marker', marker.toString());
        input = `${path}?${params.toString()}`;
      }

      return baseFetch(
        input,
        {
          ...init,
          headers,
        } as Parameters<T>[1],
      ).then((response) => {
        //FIXME: deal with unauthorized responses even when the client has a 'valid' token

        return response;
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
