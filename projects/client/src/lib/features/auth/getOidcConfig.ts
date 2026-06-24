import { getReferrer } from '$lib/utils/requests/getReferrer.ts';
import { isWorkerAuthHost } from '$lib/utils/url/isWorkerAuthHost.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { type UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

function getAuthority() {
  // Worker-auth beta: on the workers.dev host, run OAuth through the worker.
  if (isWorkerAuthHost(globalThis.window?.location.hostname)) {
    return prependHttps('auth.trakt.tv');
  }

  return prependHttps(
    TRAKT_TARGET_ENVIRONMENT
      .replace('api.', '')
      .replace('apiz.', '')
      .replace('hd.', '')
      .replace('api-staging.', 'staging.'),
  );
}

export function getOidcConfig(): UserManagerSettings {
  const referrer = getReferrer();

  return {
    authority: getAuthority(),
    client_id: TRAKT_CLIENT_ID,
    redirect_uri: `${referrer}/callback`,
    silent_redirect_uri: `${referrer}/silent-redirect`,
    response_type: 'code',
    scope: 'public openid profile email',
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({
      store: globalThis.window.localStorage,
    }),
  };
}
