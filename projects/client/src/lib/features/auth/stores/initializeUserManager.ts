import { browser } from '$app/environment';
import { User, UserManager } from 'oidc-client-ts';
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
      isRefreshing: readable(false),
    };
  }

  const isRefreshing = writable(false);
  const { isAuthorized } = getAuthContext();

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
  };

  const handleUserEvent = (user: User | null) => {
    postAuth(user);
    setAuthState(user);
  };

  const initializeUser = async (user: User | null) => {
    if (user?.expired) {
      isRefreshing.set(true);

      const refreshedUser = await manager.signinSilent();
      handleUserEvent(refreshedUser);

      isRefreshing.set(false);
      return;
    }

    setAuthState(user);
  };

  manager.getUser().then(initializeUser);
  manager.events.addUserLoaded(handleUserEvent);
  manager.events.addUserUnloaded(() => handleUserEvent(null));
  manager.events.addSilentRenewError(() => handleUserEvent(null));

  setUserManager(manager);

  return {
    isRefreshing: derived(isRefreshing, ($isRefreshing) => $isRefreshing),
  };
}
