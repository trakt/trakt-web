import { setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Token } from '../token/index.ts';

export const AUTH_CONTEXT_KEY = Symbol('auth-is-authorized');

export function createAuthContext(initial: {
  isAuthorized: boolean;
  token: Token | Nil;
}) {
  const isAuthorized = writable(initial.isAuthorized);
  const token = writable<Token | null>(initial.token);

  setContext(AUTH_CONTEXT_KEY, {
    isAuthorized,
    token,
  });
}
