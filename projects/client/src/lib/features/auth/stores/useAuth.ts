import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { buildOAuthUrl } from '$lib/utils/url/buildOAuthLink.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { workerRequest } from '$worker/workerRequest.ts';
import { setToken } from '../token/index.ts';
import { getAuthContext } from './getAuthContext.ts';

export function useAuth() {
  const { isAuthorized } = getAuthContext();
  const { invalidate } = useInvalidator();

  const logout = async () => {
    await fetch('/api/store-legacy-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: null, expiresAt: null }),
    });

    setToken(null);
    isAuthorized.next(false);

    await invalidate(InvalidateAction.Auth);
    await workerRequest(WorkerMessage.CacheBust);

    globalThis.window.location.href = 'https://trakt.tv/logout';
  };

  const login = () => {
    const url = buildOAuthUrl(
      TRAKT_CLIENT_ID,
      globalThis.window.location.origin,
    );
    globalThis.window.location.href = url;
  };

  return {
    isAuthorized,
    logout,
    login,
  };
}
