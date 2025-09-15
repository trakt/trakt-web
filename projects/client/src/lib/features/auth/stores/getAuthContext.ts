import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Token } from '../token/index.ts';
import { AUTH_CONTEXT_KEY } from './createAuthContext.ts';

export function getAuthContext() {
  const ctx = assertDefined<{
    isAuthorized: Writable<boolean>;
    token: Writable<Token | null>;
  }>(
    getContext(AUTH_CONTEXT_KEY),
    'Auth can only be used within the AuthProvider context!',
  );

  return ctx;
}
