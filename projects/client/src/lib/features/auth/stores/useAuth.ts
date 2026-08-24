import { getLocale } from '$lib/features/i18n/index.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { error as printError } from '$lib/utils/console/print.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { loginErrorStore } from '../_internal/loginErrorStore.ts';
import { writeAuthMarker } from '../authMarker.ts';
import { mapToLoginError } from '../mapToLoginError.ts';
import { LoginErrorType } from '../models/LoginErrorType.ts';
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
    // `signoutRedirect` marks storage via `addUserUnloaded`, but navigates away
    // on the next statement with that write unawaited. Await it here instead.
    await writeAuthMarker(false);

    await invalidate(InvalidateAction.Auth);
    await workerRequest(WorkerMessage.CacheBust);

    // End the session at the provider (RP-initiated logout) so it's a real
    // logout, not just a local token revoke. signoutRedirect clears the local
    // user and navigates, returning to this origin.
    await manager?.signoutRedirect({
      post_logout_redirect_uri: globalThis.window?.location?.origin,
    });
  };

  const login = async () => {
    const manager = getUserManager();

    loginErrorStore.clear();

    if (!manager) {
      printError('Failed to start sign-in: no user manager');
      loginErrorStore.set(LoginErrorType.Unreachable);
      return;
    }

    const [language, region] = getLocale().split('-');
    const lang = region ? `${language}-${region.toUpperCase()}` : language;

    try {
      await manager.signinRedirect({
        extraQueryParams: {
          hide_email_form: 'true',
          lang,
        },
      });
    } catch (error) {
      printError('Failed to start sign-in:', error);
      loginErrorStore.set(mapToLoginError(error));
    }
  };

  return {
    isAuthorized,
    logout,
    login,
  };
}
