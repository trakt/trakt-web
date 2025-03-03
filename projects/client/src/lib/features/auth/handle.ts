import { time } from '$lib/utils/timing/time.ts';
import { prependHttpOrHttps } from '$lib/utils/url/prependHttpOrHttps.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import type {
  SerializedAuthResponse,
} from './models/SerializedAuthResponse.ts';
import { authorize } from './requests/authorize.ts';

export const AUTH_COOKIE_NAME = 'trakt-auth';
const REFRESH_THRESHOLD_MINUTES = 15;

function getAuth(event: RequestEvent): SerializedAuthResponse | null {
  try {
    const serializedToken = event.cookies.get(AUTH_COOKIE_NAME) ?? '';
    return JSON.parse(serializedToken) as SerializedAuthResponse;
  } catch (_) {
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
        JSON.stringify(result),
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

  const authResponse = getAuth(event);

  const minutesToExpiry = Math.floor(
    (new Date(authResponse?.expiresAt ?? 0).getTime() - Date.now()) /
      time.minutes(1),
  );
  const shouldRefresh = minutesToExpiry <= REFRESH_THRESHOLD_MINUTES;

  if (shouldRefresh && authResponse?.token.refresh != null) {
    const result = await authorize({
      token: {
        type: 'refresh',
        refreshToken: authResponse.token.refresh,
      },
      referrer: getReferrer(),
    });

    setAuth(result);
    event.cookies.set(
      AUTH_COOKIE_NAME,
      JSON.stringify(result),
      {
        httpOnly: true,
        secure: true,
        expires: new Date(result.expiresAt ?? 0),
        path: '/',
      },
    );

    return await resolve(event);
  }

  setAuth(authResponse);

  if (!authResponse) {
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
