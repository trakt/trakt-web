import { getReferrer } from '$lib/utils/requests/getReferrer.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { type UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';
import { resolveOidcAuthority } from './resolveOidcAuthority.ts';

export function getOidcConfig(): UserManagerSettings {
  const referrer = getReferrer();

  return {
    authority: resolveOidcAuthority(),
    client_id: TRAKT_CLIENT_ID,
    redirect_uri: `${referrer}/callback`,
    silent_redirect_uri: `${referrer}/silent-redirect`,
    response_type: 'code',
    scope: 'public openid profile email',
    automaticSilentRenew: true,
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
