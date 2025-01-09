import { type Handle } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import { key } from './environment.ts';
import type {
  SerializedAuthResponse,
} from './models/SerializedAuthResponse.ts';
import { authorize } from './requests/authorize.ts';
import { decrypt } from './utils/decrypt.ts';
import { encrypt } from './utils/encrypt.ts';

const AUTH_COOKIE_NAME = 'trakt-auth';

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

  const isExchange = event.url.pathname.startsWith(AuthEndpoint.Exchange);

  if (isExchange) {
    const { code } = await event.request.json() as { code: string };
    const referrer = event.request.headers.get('referer') ?? '';

    const result = await authorize({ code, referrer });
    const { isAuthorized } = result;
    setAuth(result);

    const cookieHeader = isAuthorized
      ? {
        'Set-Cookie': event.cookies.serialize(
          AUTH_COOKIE_NAME,
          await encrypt(key, result),
          {
            httpOnly: true,
            secure: true,
            maxAge: result.expiresAt ?? 0,
            path: '/',
          },
        ),
      }
      : {} as Record<string, string>;

    return new Response(
      JSON.stringify({
        isAuthorized,
      }),
      {
        headers: { ...cookieHeader },
      },
    );
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
  }

  return await resolve(event);
};
