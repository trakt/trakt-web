import { type Handle, type RequestEvent } from '@sveltejs/kit';
import type { OidcAuthToken } from './models/OidcAuthToken.ts';

export const OIDC_AUTH_COOKIE_NAME = 'trakt-oidc-auth';

function getOidcToken(event: RequestEvent) {
  try {
    const oidcTokenCookie = event.cookies.get(OIDC_AUTH_COOKIE_NAME) ?? '';
    return JSON.parse(oidcTokenCookie) as OidcAuthToken;
  } catch (_) {
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const oidcToken = getOidcToken(event);
  event.locals.oidcAuth = oidcToken;

  return await resolve(event);
};
