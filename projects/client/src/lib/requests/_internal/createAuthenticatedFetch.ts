import { getToken } from '$lib/features/auth/token/index.ts';

import { error } from '$lib/utils/console/print.ts';
import { getUserManager } from '../../features/auth/stores/userManager.ts';
import { safeSessionStorage } from '../../utils/storage/safeStorage.ts';

const SESSION_STORAGE_REFRESH_KEY = 'trakt:is_refreshing';

const hasRequestedRefresh = () =>
  Boolean(safeSessionStorage.getItem(SESSION_STORAGE_REFRESH_KEY));

const setRefreshKey = () =>
  safeSessionStorage.setItem(SESSION_STORAGE_REFRESH_KEY, 'true');

const clearRefreshKey = () =>
  safeSessionStorage.removeItem(SESSION_STORAGE_REFRESH_KEY);

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

      return baseFetch(
        input,
        {
          ...init,
          headers,
        } as Parameters<T>[1],
      ).then((response) => {
        if (response.status === 401 && !hasRequestedRefresh()) {
          setRefreshKey();
          getUserManager()?.removeUser().then(() =>
            globalThis.window.location.reload()
          );
        }

        if (response.status !== 401) {
          clearRefreshKey();
        }

        return response;
      });
    } catch (e) {
      error('Fetch interceptor error:', e);
      return baseFetch(input, init);
    }
  }) as unknown as T;
}
