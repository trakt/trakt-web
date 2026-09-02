import { browser } from '$app/environment';
import { FETCH_ERROR_EVENT } from '$lib/features/errors/constants.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { type User, UserManager } from 'oidc-client-ts';
import { BehaviorSubject, of } from 'rxjs';
import { onMount } from 'svelte';
import { writeAuthMarker } from '../authMarker.ts';
import { createSilentRenewGuard } from '../createSilentRenewGuard.ts';
import { deriveStandardAuthority } from '../deriveStandardAuthority.ts';
import { getOidcConfig } from '../getOidcConfig.ts';
import { isFatalRenewError } from '../isFatalRenewError.ts';
import { isRateLimitError } from '../isRateLimitError.ts';
import { mapToToken } from '../mapToToken.ts';
import { portWorkerAuthSession } from '../portWorkerAuthSession.ts';
import { postToken } from '../postToken.ts';
import { renewAccessToken } from '../renewAccessToken.ts';
import { resolveOidcAuthority } from '../resolveOidcAuthority.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { time } from '$lib/utils/timing/time.ts';
import { setToken, type Token } from '../token/index.ts';
import type { AuthContextType } from './createAuthContext.ts';
import { setUserManager } from './userManager.ts';

const renewCooldown = time.seconds(30);
const maxRenewFailures = 3;
const renewFailureReset = time.minutes(5);

type InitializeUserManagerParams = {
  ctx: AuthContextType;
  tokenFromServer?: string | null;
  /** Whether a session cookie reached the server, valid or lapsed. */
  hasServerSession?: boolean;
  /** Skip the `manager.getUser()` gate when the caller already seeded `ctx`. */
  isResolved?: boolean;
};

export function initializeUserManager(
  {
    ctx,
    tokenFromServer,
    hasServerSession = false,
    isResolved = false,
  }: InitializeUserManagerParams,
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

    const renewGuard = createSilentRenewGuard({
      now: () => Date.now(),
      cooldownMs: renewCooldown,
      maxConsecutiveFailures: maxRenewFailures,
      failureResetMs: renewFailureReset,
    });

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

    const handleSilentRenewFailure = async (error: unknown) => {
      if (isRateLimitError(error) && isInitializing.value) {
        dispatchRateLimitError();
      }

      if (isFatalRenewError(error)) {
        await manager.removeUser().catch(() => {});
        handleUserEvent(null);
        return;
      }

      // A surviving refresh token means the session is still spendable and
      // only the attempt failed. Gating on the access token instead tore the
      // session down for every renewal that ran past its expiry - which is
      // every renewal, since that expiry is what triggers them.
      const current = await manager.getUser().catch(() => null);
      if (current?.refresh_token == null) {
        handleUserEvent(null);
      }
    };

    const renewUnderLock = async () => {
      const { user, didAdopt } = await renewAccessToken(manager);

      // `signinSilent` raises `userLoaded`; an adopted token does not.
      if (didAdopt) {
        handleUserEvent(user);
      }
    };

    const renewSilently = () => {
      renewGuard
        .renew(renewUnderLock)
        .catch(handleSilentRenewFailure)
        // The guard resolves without attempting once its breaker is open, and
        // a gated tree that never hears back renders nothing at all.
        .finally(() => isInitializing.next(false));
    };

    const initializeUser = (user: User | null) => {
      if (user?.expired) {
        renewSilently();
        return;
      }

      if (!user) {
        // A cookie the client cannot back with a session keeps the server
        // routing this viewer as signed in, and nothing else clears it.
        if (hasServerSession) {
          handleUserEvent(null);
          return;
        }

        setAuthState({ token: mapToToken(null), isExpired: true });
        return;
      }

      const token = mapToToken(user);
      setAuthState({ token, isExpired: user.expired ?? true });
      syncToken(user);
    };

    const checkTokenOnFocus = async () => {
      const user = await manager.getUser();
      if (!user?.expired) {
        return;
      }

      renewSilently();
    };

    const disposeExpiring = manager.events.addAccessTokenExpiring(
      renewSilently,
    );
    const disposeExpired = manager.events.addAccessTokenExpired(
      renewSilently,
    );
    const disposeUserLoaded = manager.events.addUserLoaded(handleUserEvent);
    const disposeUserUnloaded = manager.events.addUserUnloaded(
      () => handleUserEvent(null),
    );

    manager.getUser().then(initializeUser);

    globalThis.window.addEventListener('focus', checkTokenOnFocus);

    setUserManager(manager);

    return () => {
      disposeExpiring();
      disposeExpired();
      disposeUserLoaded();
      disposeUserUnloaded();
      globalThis.window.removeEventListener('focus', checkTokenOnFocus);
      setUserManager(null);
    };
  });

  return {
    isInitializing: isInitializing.asObservable(),
  };
}
