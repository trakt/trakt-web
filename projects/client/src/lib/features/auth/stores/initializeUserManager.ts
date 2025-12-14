import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time.ts';
import { type User, UserManager } from 'oidc-client-ts';
import { BehaviorSubject, of } from 'rxjs';
import { onMount } from 'svelte';
import { getOidcConfig } from '../getOidcConfig.ts';
import { setToken, type Token } from '../token/index.ts';
import { postToken } from './_internal/postToken.ts';
import { getAuthContext } from './getAuthContext.ts';
import { setUserManager } from './userManager.ts';

function mapToToken(user: User | null): Token {
  const expiresAt = user?.expires_at ? time.seconds(user.expires_at) : null;

  return {
    value: user?.access_token ?? null,
    expiresAt,
  };
}

export function initializeUserManager(tokenFromServer?: string | null) {
  if (!browser) {
    return {
      isInitializing: of(false),
    };
  }

  const isInitializing = new BehaviorSubject(true);
  const ctx = getAuthContext();

  onMount(() => {
    const manager = new UserManager(
      getOidcConfig(),
    );

    const syncToken = (user: User | null) => {
      if (!user) return;
      if (user.access_token === tokenFromServer) return;

      postToken(mapToToken(user));
    };

    const setAuthState = (
      { token, isExpired }: { token: Token; isExpired: boolean },
    ) => {
      setToken(token);
      ctx.token.next(token);

      ctx.isAuthorized.next(!isExpired);
      isInitializing.next(false);
    };

    const handleUserEvent = (user: User | null) => {
      const token = mapToToken(user);
      const isExpired = user?.expired ?? true;

      postToken(token);
      setAuthState({ token, isExpired });
    };

    const initializeUser = (user: User | null) => {
      if (user?.expired) {
        manager.signinSilent().catch(() => handleUserEvent(null));
        return;
      }

      const token = mapToToken(user);
      setAuthState({ token, isExpired: user?.expired ?? true });
      syncToken(user);
    };

    const checkTokenOnFocus = async () => {
      const user = await manager.getUser();
      if (!user?.expired) {
        return;
      }

      manager.signinSilent().catch(() => handleUserEvent(null));
    };

    manager.getUser().then(initializeUser);
    manager.events.addUserLoaded(handleUserEvent);
    manager.events.addUserUnloaded(() => handleUserEvent(null));
    manager.events.addSilentRenewError(() => handleUserEvent(null));

    globalThis.window.addEventListener('focus', checkTokenOnFocus);

    setUserManager(manager);

    return () => {
      globalThis.window.removeEventListener('focus', checkTokenOnFocus);
      setUserManager(null);
    };
  });

  return {
    isInitializing: isInitializing.asObservable(),
  };
}
