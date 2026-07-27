import { browser } from '$app/environment';
import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { type User, UserManager } from 'oidc-client-ts';
import { BehaviorSubject, of } from 'rxjs';
import { onMount } from 'svelte';
import { writeAuthMarker } from '../authMarker.ts';
import { deriveStandardAuthority } from '../deriveStandardAuthority.ts';
import { getOidcConfig } from '../getOidcConfig.ts';
import { portWorkerAuthSession } from '../portWorkerAuthSession.ts';
import { resolveOidcAuthority } from '../resolveOidcAuthority.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { setToken, type Token } from '../token/index.ts';
import { postToken } from './_internal/postToken.ts';
import type { AuthContextType } from './createAuthContext.ts';
import { setUserManager } from './userManager.ts';

function mapToToken(user: User | null): Token {
  const expiresAt = user?.expires_at ? time.seconds(user.expires_at) : null;

  return {
    value: user?.access_token ?? null,
    expiresAt,
  };
}

type InitializeUserManagerParams = {
  ctx: AuthContextType;
  tokenFromServer?: string | null;
  /** Skip the `manager.getUser()` gate when the caller already seeded `ctx`. */
  isResolved?: boolean;
};

export function initializeUserManager(
  { ctx, tokenFromServer, isResolved = false }: InitializeUserManagerParams,
) {
  if (!browser) {
    return {
      isInitializing: of(false),
    };
  }

  const isInitializing = new BehaviorSubject(!isResolved);

  onMount(() => {
    // Carry an existing session across an authority change so it is kept
    // instead of orphaned under the old key (which logs the user out).
    portWorkerAuthSession({
      store: safeLocalStorage,
      clientId: TRAKT_CLIENT_ID,
      fromAuthority: deriveStandardAuthority(),
      toAuthority: resolveOidcAuthority(),
    });

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

      const nextIsAuthorized = !isExpired;
      const didAuthorizationChange =
        ctx.isAuthorized.value !== nextIsAuthorized;

      ctx.isAuthorized.next(nextIsAuthorized);
      isInitializing.next(false);

      // Written on every resolution, not just on change, so the worker stays
      // correct after a cache eviction or a fresh install.
      void writeAuthMarker(nextIsAuthorized);

      if (didAuthorizationChange) {
        // Best-effort: the SW may be unavailable (private mode, blocked).
        // Swallow so a failed bust never surfaces as an unhandled rejection.
        void workerRequest(WorkerMessage.CacheBust).catch(() => {});
      }
    };

    const handleUserEvent = (user: User | null) => {
      const token = mapToToken(user);
      const isExpired = user?.expired ?? true;

      postToken(token);
      setAuthState({ token, isExpired });
    };

    const dispatchRateLimitError = () => {
      globalThis.window.dispatchEvent(
        new CustomEvent(FETCH_ERROR_EVENT, {
          detail: {
            status: 429,
            message: 'Rate limited during token renewal',
          },
        }),
      );
    };

    const handleSilentRenewFailure = (error: unknown) => {
      if (error instanceof Error && error.message.includes('429')) {
        dispatchRateLimitError();
      }
      handleUserEvent(null);
    };

    const initializeUser = (user: User | null) => {
      if (user?.expired) {
        manager.signinSilent().catch(handleSilentRenewFailure);
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

      manager.signinSilent().catch(handleSilentRenewFailure);
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
