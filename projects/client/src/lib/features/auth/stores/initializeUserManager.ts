import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time.ts';
import { User, UserManager } from 'oidc-client-ts';
import { onMount } from 'svelte';
import { derived, readable, writable } from 'svelte/store';
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

export function initializeUserManager(hasLegacyAuth: boolean) {
  if (!browser || hasLegacyAuth) {
    return {
      isInitializing: readable(false),
    };
  }

  const isInitializing = writable(true);
  const ctx = getAuthContext();

  onMount(() => {
    const manager = new UserManager(
      getOidcConfig(),
    );

    const setAuthState = (
      { token, isExpired }: { token: Token; isExpired: boolean },
    ) => {
      setToken(token);
      ctx.token.set(token);

      ctx.isAuthorized.set(!isExpired);
      isInitializing.set(false);
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
    isInitializing: derived(
      isInitializing,
      ($isInitializing) => $isInitializing,
    ),
  };
}
