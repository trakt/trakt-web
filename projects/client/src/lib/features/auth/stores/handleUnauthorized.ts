import { error } from '$lib/utils/console/print.ts';
import { getUserManager } from './userManager.ts';

/**
 * Handles 401 unauthorized responses for OIDC users by attempting
 * to silently refresh the token. If refresh fails, removes the user
 * (which triggers logout via existing event handlers).
 *
 * Returns true if the token was successfully refreshed, false otherwise.
 */
export async function handleUnauthorized(): Promise<{ isRefreshed: boolean }> {
  const manager = getUserManager();
  if (!manager) {
    return { isRefreshed: false };
  }

  try {
    const user = await manager.signinSilent();

    if (user && !user.expired) {
      return { isRefreshed: true };
    }

    await manager.removeUser();
    return { isRefreshed: false };
  } catch (err) {
    error('Silent token refresh failed:', err);
    await manager.removeUser();
    return { isRefreshed: false };
  }
}
