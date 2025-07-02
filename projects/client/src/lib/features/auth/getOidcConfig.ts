import { type UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

const TRAKT_OIDC_AUTHORITY = 'https://trakt.tv';

export function getOidcConfig(origin: string): UserManagerSettings {
  return {
    authority: TRAKT_OIDC_AUTHORITY,
    client_id: TRAKT_CLIENT_ID,
    redirect_uri: `${origin}/callback`,
    silent_redirect_uri: `${origin}/silent-redirect`,
    response_type: 'code',
    scope: 'public openid profile email',
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({
      store: globalThis.window.localStorage,
    }),
  };
}
