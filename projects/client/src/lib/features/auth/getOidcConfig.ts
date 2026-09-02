import { getReferrer } from '$lib/utils/requests/getReferrer.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { type UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';
import { resolveOidcAuthority } from './resolveOidcAuthority.ts';

// The renewal POST rotates the refresh token the moment it lands, so aborting
// it early strands the one it minted. oidc-client-ts defaults to 10s there,
// and to no timeout at all for the discovery fetch.
const RENEW_TIMEOUT_SECONDS = 30;
const DISCOVERY_TIMEOUT_SECONDS = 15;

export function getOidcConfig(): UserManagerSettings {
  const referrer = getReferrer();

  return {
    authority: resolveOidcAuthority(),
    client_id: TRAKT_CLIENT_ID,
    redirect_uri: `${referrer}/callback`,
    silent_redirect_uri: `${referrer}/silent-redirect`,
    response_type: 'code',
    scope: 'public openid profile email',
    automaticSilentRenew: false,
    silentRequestTimeoutInSeconds: RENEW_TIMEOUT_SECONDS,
    requestTimeoutInSeconds: DISCOVERY_TIMEOUT_SECONDS,
    userStore: new WebStorageStateStore({
      store: safeLocalStorage,
    }),
    // Set stateStore explicitly too: oidc-client-ts otherwise defaults it to
    // raw window.localStorage, which throws SecurityError in sandboxed contexts.
    stateStore: new WebStorageStateStore({
      store: safeLocalStorage,
    }),
  };
}
