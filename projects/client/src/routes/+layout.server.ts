import { hasAuthSession } from '$lib/features/auth/hasAuthSession.ts';
import { isAuthorizedToken } from '$lib/features/auth/isAuthorizedToken.ts';
import type { OidcAuthToken } from '$lib/features/auth/models/OidcAuthToken.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { isBotAgent } from '$lib/utils/devices/isBotAgent.ts';
import type { LayoutServerLoad } from '$types/$types.d.ts';

const getAuth = (auth: Nil | OidcAuthToken) => {
  // Presence and validity are separate: routing keys off the former, but a
  // cookie whose token has lapsed must not seed the client with a dead token.
  const hasSession = hasAuthSession(auth);

  if (!isAuthorizedToken(auth)) {
    return {
      token: null,
      expiresAt: null,
      isAuthorized: false,
      hasSession,
    };
  }

  return {
    token: auth.token,
    expiresAt: auth.expiresAt,
    isAuthorized: true,
    hasSession,
  };
};

export const load: LayoutServerLoad = (
  { request, locals },
) => {
  const defaultResponse = {
    theme: locals.theme,
    oidcAuth: getAuth(locals.oidcAuth),
    isLegitimateBot: locals.isLegitimateBot,
    isBot: isBotAgent(request.headers.get('user-agent')),
    device: getDeviceType(request.headers.get('user-agent')),
    typesense: locals.typesense,
  };

  return defaultResponse;
};
