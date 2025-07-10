import { browser } from '$app/environment';
import { User, UserManager } from 'oidc-client-ts';
import { onMount } from 'svelte';
import { derived, readable, writable } from 'svelte/store';
import { getOidcConfig } from '../getOidcConfig.ts';
import type { OidcAuthToken } from '../models/OidcAuthToken.ts';
import { setToken } from '../token/index.ts';
import { getAuthContext } from './getAuthContext.ts';
import { setUserManager } from './userManager.ts';

function postAuth(user: User | null) {
  const payload: OidcAuthToken = {
    token: user?.access_token ?? null,
    expiresAt: user?.expires_at ?? null,
  };

  fetch('/api/store-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function initializeUserManager(hasLegacyAuth: boolean) {
  if (!browser || hasLegacyAuth) {
    return {
      isInitializing: readable(false),
    };
  }

  const isInitializing = writable(true);
  const { isAuthorized } = getAuthContext();

  onMount(() => {
    const manager = new UserManager(
      getOidcConfig(),
    );

    const setAuthState = (user: User | null) => {
      setToken({
        value: user?.access_token,
        expiresAt: user?.expires_at,
      });

      const isExpiredUser = user?.expired ?? true;
      isAuthorized.set(!isExpiredUser);
      isInitializing.set(false);
    };

    const handleUserEvent = (user: User | null) => {
      postAuth(user);
      setAuthState(user);
    };

    const initializeUser = (user: User | null) => {
      if (user?.expired) {
        manager.signinSilent()
          .catch(() => handleUserEvent(null));

        return;
      }

      setAuthState(user);
    };

    manager.getUser().then(initializeUser);
    manager.events.addUserLoaded(handleUserEvent);
    manager.events.addUserUnloaded(() => handleUserEvent(null));
    manager.events.addSilentRenewError(() => handleUserEvent(null));

    setUserManager(manager);

    return () => {
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
