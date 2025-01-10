import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import { key } from './environment.ts';
import type {
  SerializedAuthResponse,
} from './models/SerializedAuthResponse.ts';
import { authorize } from './requests/authorize.ts';
import { decrypt } from './utils/decrypt.ts';
import { encrypt } from './utils/encrypt.ts';

const AUTH_COOKIE_NAME = 'trakt-auth';

function getLegacyAuthCookie(event: RequestEvent) {
  try {
    const serializedToken = event.cookies.get(AUTH_COOKIE_NAME) ?? '';
    return JSON.parse(serializedToken) as SerializedAuthResponse;
  } catch (error) {
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const setAuth = (auth: SerializedAuthResponse | Nil) => {
    event.locals.auth = auth;
  };

  const isLogout = event.url.pathname.startsWith(AuthEndpoint.Logout);

  if (isLogout) {
    setAuth(null);
    return new Response(null, {
      headers: {
        'Set-Cookie': event.cookies.serialize(AUTH_COOKIE_NAME, '', {
          httpOnly: true,
          secure: true,
          maxAge: 0,
          path: '/',
        }),
      },
    });
  }

  const code = event.url.searchParams.get('code');
  const isExchange = code != null;

  if (isExchange) {
    const referrer = event.request.headers.get('referer') ?? '';

    const result = await authorize({ code, referrer });
    const { isAuthorized } = result;
    setAuth(result);

    const url = new URL(event.url);
    url.searchParams.delete('code');

    const headers = new Headers();

    if (isAuthorized) {
      const cookie = event.cookies.serialize(
        AUTH_COOKIE_NAME,
        await encrypt(key, result),
        {
          httpOnly: true,
          secure: true,
          maxAge: result.expiresAt ?? 0,
          path: '/',
        },
      );

      headers.set('Set-Cookie', cookie);
    }

    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(headers),
        Location: url.toString(),
      },
    });
  }

  //TODO: remove this migration after March 1st 2025
  const legacyAuthCookie = getLegacyAuthCookie(event);
  if (legacyAuthCookie != null) {
    setAuth(legacyAuthCookie);

    event.cookies.set(
      AUTH_COOKIE_NAME,
      await encrypt(key, legacyAuthCookie),
      {
        httpOnly: true,
        secure: true,
        maxAge: legacyAuthCookie.expiresAt ?? 0,
        path: '/',
      },
    );

    return await resolve(event);
  }

  /**
   * TODO: refresh exchange flow here
   * https://trakt.docs.apiary.io/#reference/authentication-oauth/get-token/exchange-refresh_token-for-access_token
   */
  const encrypted = event.cookies.get(AUTH_COOKIE_NAME);
  const decrypted = await decrypt<SerializedAuthResponse>(key, encrypted);
  const isDecryptionFailed = decrypted == null && encrypted != null;
  setAuth(decrypted);

  if (isDecryptionFailed) {
    event.cookies.set(AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: '/',
    });

    return await resolve(event);
  }

  return await resolve(event);
};
