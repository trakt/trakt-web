import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { isWorkerAuthHost } from '$lib/utils/url/isWorkerAuthHost.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { setToken } from '../token/index.ts';
import { getAuthContext } from './getAuthContext.ts';
import { getUserManager } from './userManager.ts';

export function useAuth() {
  const { isAuthorized } = getAuthContext();
  const { invalidate } = useInvalidator();

  const logout = async () => {
    const manager = getUserManager();

    await manager?.revokeTokens();

    setToken(null);
    isAuthorized.next(false);

    await invalidate(InvalidateAction.Auth);
    await workerRequest(WorkerMessage.CacheBust);

    // On the worker auth host, end the session at the provider (RP-initiated
    // logout) so it's a real logout, not just a local token revoke. signoutRedirect
    // clears the local user and navigates, returning to this origin.
    if (manager && isWorkerAuthHost(globalThis.window?.location?.hostname)) {
      await manager.signoutRedirect({
        post_logout_redirect_uri: globalThis.window?.location?.origin,
      });
      return;
    }

    await manager?.removeUser();
    // FIXME: legacy logout path. Remove once the new auth host is used
    // everywhere - then logout is just revokeTokens() + signoutRedirect().
    globalThis.window.location.href = 'https://trakt.tv/logout';
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
