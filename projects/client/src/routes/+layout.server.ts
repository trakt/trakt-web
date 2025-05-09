import { AUTH_COOKIE_NAME } from '$lib/features/auth/handle.ts';
import { setToken } from '$lib/features/auth/token/index.ts';
import { isAuthorized } from '$lib/features/auth/utils/isAuthorized.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';
import { buildOAuthUrl } from '$lib/utils/url/buildOAuthLink.ts';

import type { LayoutServerLoad } from './$types.ts';

export const load: LayoutServerLoad = (
  { cookies, request, locals },
) => {
  const requestUrl = new URL(request.url);

  const defaultResponse = {
    theme: locals.theme,
    auth: {
      url: buildOAuthUrl(TRAKT_CLIENT_ID, requestUrl.origin),
      isAuthorized: isAuthorized(locals),
      token: null as string | Nil,
      expiresAt: null as number | Nil,
    },
    isBot: isBotAgent(request.headers.get('user-agent')),
    device: getDeviceType(request.headers.get('user-agent')),
    hasConsent: locals.hasConsent,
  };

  if (!locals.auth) {
    setToken(null);
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    return defaultResponse;
  }

  defaultResponse.auth.token = locals.auth.token.access;
  defaultResponse.auth.expiresAt = locals.auth.expiresAt;
  return defaultResponse;
};
