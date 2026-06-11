import { env } from '$env/dynamic/private';
import { IS_PROD } from '$lib/utils/env/index.ts';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import type { OidcAuthToken } from './models/OidcAuthToken.ts';

export const OIDC_AUTH_COOKIE_NAME = 'trakt-oidc-auth';
export const LEGACY_AUTH_COOKIE_NAME = 'trakt-auth';

function parseCookieToken(event: RequestEvent, cookieName: string) {
  try {
    const cookie = event.cookies.get(cookieName) ?? '';
    return JSON.parse(cookie) as OidcAuthToken;
  } catch (_) {
    return null;
  }
}

function isPageRequest(event: RequestEvent) {
  const accept = event.request.headers.get('accept') ?? '';
  return accept.includes('text/html');
}

async function exchangeCode(
  code: string,
  redirectUri: string,
  fetchFn: typeof fetch,
): Promise<OidcAuthToken | null> {
  const clientSecret = env.TRAKT_CLIENT_SECRET ?? '';
  const clientId = env.TRAKT_CLIENT_ID ?? TRAKT_CLIENT_ID;

  console.log('[legacy-auth] exchangeCode', {
    environment: TRAKT_TARGET_ENVIRONMENT,
    redirectUri,
    hasSecret: Boolean(clientSecret),
  });

  // Use globalThis.fetch (not event.fetch) to avoid SvelteKit SSR restrictions.
  // The code was issued by trakt.tv/oauth/authorize, so it must be exchanged
  // at the same domain — trakt.tv/oauth/token (no api./apiz. prefix).
  const exchangeUrl = 'https://trakt.tv/oauth/token';

  console.log('[legacy-auth] exchanging at', exchangeUrl, {
    clientId,
    hasSecret: Boolean(clientSecret),
    redirectUri,
  });

  const rawResponse = await globalThis
    .fetch(exchangeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Origin': 'https://trakt.tv',
        'Referer': 'https://trakt.tv/',
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    .catch((err: unknown) => {
      console.log('[legacy-auth] exchange error:', err);
      return null;
    });

  if (!rawResponse) return null;

  const responseBody = await rawResponse.text().catch(() => '');
  console.log(
    '[legacy-auth] exchange response',
    rawResponse.status,
    responseBody,
  );

  if (!rawResponse.ok) return null;

  const { access_token, expires_in, created_at } = JSON.parse(
    responseBody,
  ) as {
    access_token: string;
    expires_in: number;
    created_at: number;
  };

  console.log('[legacy-auth] exchange OK');

  return {
    token: access_token,
    expiresAt: created_at + expires_in,
  };
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.oidcAuth = parseCookieToken(event, OIDC_AUTH_COOKIE_NAME);
  event.locals.legacyAuth = parseCookieToken(event, LEGACY_AUTH_COOKIE_NAME);

  const code = event.url.searchParams.get('code');
  if (code && isPageRequest(event) && !event.locals.legacyAuth?.token) {
    const legacyToken = await exchangeCode(code, event.url.origin, event.fetch);

    if (legacyToken) {
      const maxAge = legacyToken.expiresAt
        ? legacyToken.expiresAt - Math.floor(Date.now() / 1000)
        : 0;

      const redirectUrl = new URL(event.url);
      redirectUrl.searchParams.delete('code');
      redirectUrl.searchParams.delete('state');

      // event.cookies.set() is only applied by SvelteKit when resolve() is called.
      // Returning Response.redirect() bypasses that, so set the cookie manually.
      const cookieValue = encodeURIComponent(JSON.stringify(legacyToken));
      const secure = IS_PROD ? '; Secure' : '';
      const setCookie =
        `${LEGACY_AUTH_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;

      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl.toString(),
          'Set-Cookie': setCookie,
        },
      });
    }
  }

  return await resolve(event);
};
