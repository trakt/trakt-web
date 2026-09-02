import { time } from '$lib/utils/timing/time.ts';
import type { User, UserManager } from 'oidc-client-ts';

const RENEW_LOCK_NAME = 'trakt-auth-renew';

function withRenewLock<T>(task: () => Promise<T>): Promise<T> {
  if (!navigator.locks) {
    return task();
  }

  // lib.dom's LockGrantedCallback types the callback's return as a bare `T`
  // rather than `T | PromiseLike<T>`, even though the spec awaits it - so TS
  // can't infer through the promise `task` returns. The runtime does flatten
  // it, hence the cast.
  return navigator.locks.request(RENEW_LOCK_NAME, task) as unknown as Promise<
    T
  >;
}

// Refresh tokens rotate on use, so a second concurrent renewal presents a
// consumed token and the server reads it as a replay. One holder at a time per
// origin - the rest adopt what it minted instead of spending theirs again.
export function renewAccessToken(
  manager: UserManager,
  /**
   * The access token a 401 just refused, when the renewal is reactive. Storage
   * still holding it means nobody has renewed and its expiry cannot be
   * trusted, so the freshness check below must not adopt it.
   */
  rejectedToken?: string | null,
): Promise<User | null> {
  return withRenewLock(async () => {
    const current = await manager.getUser();

    const expiringAt = Date.now() + time.seconds(
      manager.settings.accessTokenExpiringNotificationTimeInSeconds,
    );
    const didAnotherHolderRenew = current != null && !current.expired &&
      current.access_token !== rejectedToken &&
      time.seconds(current.expires_at ?? 0) > expiringAt;

    if (didAnotherHolderRenew) {
      // `signinSilent` raises `userLoaded` itself; adopting has to, or only
      // the minting holder ends up writing the token.
      await manager.events.load(current);
      return current;
    }

    return await manager.signinSilent();
  });
}
