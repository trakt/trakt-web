import { setContext } from 'svelte';
import { writable } from 'svelte/store';

export const AUTH_CONTEXT_KEY = Symbol('auth-is-authorized');

export function createAuthContext({
  isAuthorized,
}: {
  isAuthorized: boolean;
}) {
  setContext(AUTH_CONTEXT_KEY, writable(isAuthorized));
}
