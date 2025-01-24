import { time } from '$lib/utils/timing/time.ts';
import { prependHttpOrHttps } from '$lib/utils/url/prependHttpOrHttps.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import { key } from './environment.ts';
import type {
  SerializedAuthResponse,
} from './models/SerializedAuthResponse.ts';
import { authorize } from './requests/authorize.ts';
import { decrypt } from './utils/decrypt.ts';
import { encrypt } from './utils/encrypt.ts';

export const AUTH_COOKIE_NAME = 'trakt-auth';
const REFRESH_THRESHOLD_WEEKS = 1;

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

  const getReferrer = () =>
    event.request.headers.get('referer') ??
      prependHttpOrHttps(event.request.headers.get('host')) ??
      '';

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
    const result = await authorize({
      token: {
        type: 'exchange',
        code,
      },
      referrer: getReferrer(),
    });
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
          expires: new Date(result.expiresAt ?? 0),
          path: '/',
        },
      );

      headers.set('Set-Cookie', cookie);
    }

    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(headers),
        Location: setCacheBuster(url).toString(),
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
        expires: new Date(legacyAuthCookie.expiresAt ?? 0),
        path: '/',
      },
    );

    return await resolve(event);
  }

  const encrypted = event.cookies.get(AUTH_COOKIE_NAME);
  const decrypted = await decrypt<SerializedAuthResponse>(key, encrypted);
  const isDecryptionFailed = decrypted == null && encrypted != null;

  const weeksToExpiry = Math.floor(
    (new Date(decrypted?.expiresAt ?? 0).getTime() - Date.now()) /
      time.weeks(1),
  );
  const shouldRefresh = weeksToExpiry <= REFRESH_THRESHOLD_WEEKS;

  if (shouldRefresh && decrypted?.token.refresh != null) {
    const result = await authorize({
      token: {
        type: 'refresh',
        refreshToken: decrypted.token.refresh,
      },
      referrer: getReferrer(),
    });

    setAuth(result);
    event.cookies.set(
      AUTH_COOKIE_NAME,
      await encrypt(key, result),
      {
        httpOnly: true,
        secure: true,
        expires: new Date(result.expiresAt ?? 0),
        path: '/',
      },
    );

    return await resolve(event);
  }

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
