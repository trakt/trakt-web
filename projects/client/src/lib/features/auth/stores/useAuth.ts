import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { AuthEndpoint } from '../AuthEndpoint.ts';
import { setToken } from '../token/index.ts';
import { getAuthContext } from './getAuthContext.ts';
import { getUserManager } from './userManager.ts';

export function useAuth() {
  const { isAuthorized } = getAuthContext();
  const { invalidate } = useInvalidator();

  const logout = async () => {
    const manager = getUserManager();
    const isLegacyLogout = Boolean(!manager);

    if (isLegacyLogout) {
      await fetch(AuthEndpoint.Logout, {
        method: 'POST',
      });
    } else {
      await manager?.revokeTokens();
      await manager?.removeUser();
    }

    setToken(null);
    isAuthorized.set(false);

    await invalidate(InvalidateAction.Auth);
    await workerRequest(WorkerMessage.CacheBust);

    isLegacyLogout && globalThis.window.location.reload();
  };

  const login = async () => {
    const manager = getUserManager();
    await manager?.signinRedirect({
      extraQueryParams: {
        hide_email_form: 'true',
      },
    });
  };

  return {
    isAuthorized,
    logout,
    login,
  };
}
