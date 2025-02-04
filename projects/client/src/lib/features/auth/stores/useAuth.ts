import { AuthEndpoint } from '$lib/features/auth/AuthEndpoint.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

function readAuth() {
  return {
    isAuthorized: assertDefined<Writable<boolean>>(
      getContext('auth-is-authorized'),
      'Auth can only be used within the AuthProvider context!',
    ),
    url: assertDefined<Writable<string>>(
      getContext('auth-url'),
      'Auth url has not been provisioned!',
    ),
  };
}

export function provisionAuth({
  isAuthorized,
  url,
}: {
  isAuthorized: boolean;
  url: string;
}) {
  setContext('auth-is-authorized', writable(isAuthorized));
  setContext('auth-url', writable(url));
}

export function useAuth() {
  const { isAuthorized, url } = readAuth();

  const { invalidate } = useInvalidator();

  const logout = async () => {
    await fetch(AuthEndpoint.Logout, {
      method: 'POST',
    });
    isAuthorized.set(false);
    await invalidate(InvalidateAction.Auth);
    globalThis.location.href = setCacheBuster(
      new URL(globalThis.location.origin),
    )
      .toString();
  };

  return {
    url,
    isAuthorized,
    logout,
  };
}
