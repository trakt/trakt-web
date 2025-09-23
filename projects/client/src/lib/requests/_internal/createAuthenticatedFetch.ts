import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';
import { safeSessionStorage } from '$lib/utils/storage/safeStorage.ts';
import { getUserManager } from '../../features/auth/stores/userManager.ts';
import { getMarker } from '../../utils/date/Marker.ts';

const SESSION_STORAGE_REFRESH_KEY = 'trakt:is_refreshing';

const stripHttpsOrHttp = (url: string): string =>
  url.replace(/^https?:\/\//, '');

function shouldReloadPage(expiresAt: number | Nil) {
  if (getUserManager()) {
    // FIXME: completely remove this refresh flow when fully switching to oidc-client-ts
    return false;
  }

  if (
    !expiresAt || safeSessionStorage.getItem(SESSION_STORAGE_REFRESH_KEY)
  ) {
    return false;
  }

  return new Date(expiresAt).getTime() - Date.now() < 0;
}

export function createAuthenticatedFetch<
  T extends typeof fetch,
>(baseFetch: T): T {
  return (function authenticatedFetch(
    input: Parameters<T>[0],
    init?: Parameters<T>[1],
  ): Promise<Response> {
    const headers = new Headers(init?.headers || {});

    try {
      const { value: token, expiresAt } = getToken();

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
        if (response.status === 401 && shouldReloadPage(expiresAt)) {
          safeSessionStorage.setItem(
            SESSION_STORAGE_REFRESH_KEY,
            'true',
          );
          globalThis.window.location.reload();
        }

        if (response.status !== 401) {
          safeSessionStorage.removeItem(SESSION_STORAGE_REFRESH_KEY);
        }

        return response;
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
