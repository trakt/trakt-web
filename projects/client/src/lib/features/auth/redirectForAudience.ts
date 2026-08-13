import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import { isAuthorizedToken } from './isAuthorizedToken.ts';
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

  const isAuthorized = isAuthorizedToken(oidcAuth);

  if (audience === 'authenticated' && !isAuthorized) {
    return redirect(307, `${UrlBuilder.landing()}${search}`);
  }

  if (audience === 'public' && isAuthorized) {
    return redirect(307, `${UrlBuilder.home()}${search}`);
  }
}
