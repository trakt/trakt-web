import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';
import type { Token } from '../token/index.ts';

export const AUTH_CONTEXT_KEY = Symbol('auth-is-authorized');

type AuthContextType = {
  isAuthorized: Writable<boolean>;
  token: Writable<Token | null>;
};

export function createAuthContext(initial: {
  isAuthorized: boolean;
  token: Token | Nil;
}) {
  const isAuthorized = writable(initial.isAuthorized);
  const token = writable<Token | null>(initial.token);

  const ctx = setContext(
    AUTH_CONTEXT_KEY,
    getContext<AuthContextType>(AUTH_CONTEXT_KEY) ??
      {
        isAuthorized,
        token,
      },
  );

  return ctx;
}
