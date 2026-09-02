import { time } from '$lib/utils/timing/time.ts';
import type { User, UserManager } from 'oidc-client-ts';

const RENEW_LOCK_NAME = 'trakt-auth-renew';

export type RenewedSession = {
  user: User | null;
  /**
   * True when another holder had already renewed, so `signinSilent` was skipped
   * and no `userLoaded` event was raised for this user.
   */
  didAdopt: boolean;
};

function withRenewLock<T>(task: () => Promise<T>): Promise<T> {
  if (!navigator.locks) {
    return task();
  }

  return navigator.locks.request(RENEW_LOCK_NAME, task);
}

// Refresh tokens rotate on use, so a second concurrent renewal presents a
// consumed token and the server reads it as a replay. One holder at a time per
// origin - the rest adopt what it minted instead of spending theirs again.
export function renewAccessToken(
  manager: UserManager,
): Promise<RenewedSession> {
  return withRenewLock(async () => {
    const current = await manager.getUser();

    const expiringAt = Date.now() + time.seconds(
      manager.settings.accessTokenExpiringNotificationTimeInSeconds,
    );
    const didAnotherHolderRenew = current != null && !current.expired &&
      time.seconds(current.expires_at ?? 0) > expiringAt;

    if (didAnotherHolderRenew) {
      return { user: current, didAdopt: true };
    }

    return { user: await manager.signinSilent(), didAdopt: false };
  });
}
