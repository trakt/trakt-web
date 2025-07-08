import { IS_DEV } from '$lib/utils/env/index.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { type UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

function getAuthority() {
  return prependHttps(
    TRAKT_TARGET_ENVIRONMENT
      .replace('api.', '')
      .replace('apiz.', '')
      .replace('api-staging.', 'staging.'),
  );
}

export function getOidcConfig(): UserManagerSettings {
  const referrer = IS_DEV ? 'http://localhost:5173' : 'https://app.trakt.tv';

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
