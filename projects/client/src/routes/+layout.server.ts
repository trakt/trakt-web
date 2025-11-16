import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';

import type { OidcAuthToken } from '$lib/features/auth/models/OidcAuthToken.ts';
import type { LayoutServerLoad } from './$types.ts';

const getAuth = (auth: Nil | OidcAuthToken) => {
  if (!auth) {
    return {
      token: null,
      expiresAt: null,
      isAuthorized: false,
    };
  }

  return {
    token: auth.token,
    expiresAt: auth.expiresAt,
    isAuthorized: true,
  };
};

export const load: LayoutServerLoad = (
  { request, locals },
) => {
  const defaultResponse = {
    theme: locals.theme,
    oidcAuth: getAuth(locals.oidcAuth),
    isBot: isBotAgent(request.headers.get('user-agent')),
    device: getDeviceType(request.headers.get('user-agent')),
    cookieConsent: locals.cookieConsent,
    typesense: locals.typesense,
  };

  return defaultResponse;
};
