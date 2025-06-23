import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import { AUTH_CONTEXT_KEY } from './createAuthContext.ts';

export function getAuthContext() {
  return {
    isAuthorized: assertDefined<Writable<boolean>>(
      getContext(AUTH_CONTEXT_KEY),
      'Auth can only be used within the AuthProvider context!',
    ),
  };
}
