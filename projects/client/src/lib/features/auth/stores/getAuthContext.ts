import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext } from 'svelte';
import type { Token } from '../token/index.ts';
import { AUTH_CONTEXT_KEY } from './createAuthContext.ts';

export function getAuthContext() {
  const ctx = assertDefined<{
    isAuthorized: BehaviorSubject<boolean>;
    token: BehaviorSubject<Token | null>;
  }>(
    getContext(AUTH_CONTEXT_KEY),
    'Auth can only be used within the AuthProvider context!',
  );

  return ctx;
}
