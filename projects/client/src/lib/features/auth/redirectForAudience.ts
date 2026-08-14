import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import { hasAuthSession } from './hasAuthSession.ts';
import type { OidcAuthToken } from './models/OidcAuthToken.ts';

type RedirectForAudienceParams = {
  audience: 'authenticated' | 'public';
  oidcAuth: Nil | OidcAuthToken;
  search: string;
  isDataRequest: boolean;
};

export function redirectForAudience(
  { audience, oidcAuth, search, isDataRequest }: RedirectForAudienceParams,
) {
  if (isDataRequest) {
    return;
  }

  // The cookie carries the access token's expiry, which lapses between visits,
  // so routing keys off session presence rather than validity.
  const hasSession = hasAuthSession(oidcAuth);

  if (audience === 'authenticated' && !hasSession) {
    return redirect(307, `${UrlBuilder.landing()}${search}`);
  }

  if (audience === 'public' && hasSession) {
    return redirect(307, `${UrlBuilder.home()}${search}`);
  }
}
