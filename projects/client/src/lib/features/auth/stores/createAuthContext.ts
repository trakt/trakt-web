import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { Token } from '../token/index.ts';

export const AUTH_CONTEXT_KEY = Symbol('auth-is-authorized');

type AuthContextType = {
  isAuthorized: BehaviorSubject<boolean>;
  token: BehaviorSubject<Token | null>;
};

export function createAuthContext(initial: {
  isAuthorized: boolean;
  token: Token | Nil;
}) {
  const isAuthorized = new BehaviorSubject(initial.isAuthorized);
  const token = new BehaviorSubject<Token | null>(initial.token ?? null);

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
