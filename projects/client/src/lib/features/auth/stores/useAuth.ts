import { setToken } from '$lib/features/auth/token/index.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext, onDestroy, setContext } from 'svelte';
import { derived, type Writable, writable } from 'svelte/store';

function readAuth() {
  return {
    token: assertDefined<Writable<string | Nil>>(
      getContext('auth-token'),
      'Auth can only be used within the AuthProvider context!',
    ),
    url: assertDefined<Writable<string>>(
      getContext('auth-url'),
      'Auth url has not been provisioned!',
    ),
  };
}

export function provisionAuth({
  token,
  url,
}: {
  token: string | Nil;
  url: string;
}) {
  setContext('auth-token', writable(token));
  setContext('auth-url', writable(url));
}

export function useAuth() {
  const { token, url } = readAuth();

  const unsubscribe = token.subscribe(setToken);

  onDestroy(unsubscribe);

  const isAuthorized = derived(token, ($token) => !!$token);

  return {
    token,
    url,
    isAuthorized,
  };
}
