import { AuthEndpoint } from '$lib/features/auth/AuthEndpoint.ts';
import { setToken } from '$lib/features/auth/token/index.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext, setContext } from 'svelte';
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

  const isAuthorized = derived(token, ($token) => !!$token);
  const { invalidate } = useInvalidator();

  const logout = async () => {
    await fetch(AuthEndpoint.Logout, {
      method: 'POST',
    });
    token.set(null);
    await invalidate(InvalidateAction.Auth);
  };

  return {
    token: {
      subscribe: token.subscribe,
      update: token.update,
      set: (value: string | Nil) => {
        token.set(value);
        setToken(value);
      },
    },
    url,
    isAuthorized,
    logout,
  };
}
