import { requestDeviceCode } from '$lib/features/auth/requests/requestDeviceCode.ts';
import { time } from '$lib/utils/timing/time.ts';
import { prependHttpOrHttps } from '$lib/utils/url/prependHttpOrHttps.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { type Handle, type RequestEvent } from '@sveltejs/kit';
import { AuthDeviceEndpoint } from './AuthDeviceEndpoint.ts';
import { AuthEndpoint } from './AuthEndpoint.ts';
import type {
  SerializedAuthResponse,
} from './models/SerializedAuthResponse.ts';
import { authorize } from './requests/authorize.ts';
import { authorizeDeviceCode } from './requests/authorizeDeviceCode.ts';

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

// FIXME: split up this file
export const handle: Handle = async ({ event, resolve }) => {
  const setAuth = (auth: SerializedAuthResponse | Nil) => {
    event.locals.auth = auth;
  };

  const getReferrer = () => prependHttpOrHttps(event.url.host) ?? '';

  const authorizedResponse = (response: SerializedAuthResponse, url: URL) => {
    const { isAuthorized } = response;
    setAuth(response);

    const headers = new Headers();

    if (isAuthorized) {
      const cookie = event.cookies.serialize(
        AUTH_COOKIE_NAME,
        JSON.stringify(response),
        {
          httpOnly: true,
          secure: true,
          maxAge: time.years(1) / time.seconds(1),
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

  const isDeviceAuth = event.url.pathname.startsWith(AuthDeviceEndpoint.Get);

  if (isDeviceAuth) {
    const response = await requestDeviceCode();

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const isDeviceAuthPoll = event.url.pathname.startsWith(
    AuthDeviceEndpoint.Poll,
  );

  if (isDeviceAuthPoll) {
    const { code } = await event.request.json() as { code: string };
    const response = await authorizeDeviceCode(code);

    if ('state' in response) {
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return authorizedResponse(response, new URL(event.url.origin));
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

    const url = new URL(event.url);
    url.searchParams.delete('code');
    return authorizedResponse(result, url);
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
        maxAge: time.years(1) / time.seconds(1),
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
