import { AUTH_COOKIE_NAME } from '$lib/features/auth/constants.ts';
import { type Handle } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import { authorize } from './requests/authorize.ts';

export const handle: Handle = async ({ event, resolve }) => {
  /**
   * TODO: refresh exchange flow here
   * https://trakt.docs.apiary.io/#reference/authentication-oauth/get-token/exchange-refresh_token-for-access_token
   */

  if (event.url.pathname.startsWith(AuthEndpoint.Exchange)) {
    const { code } = await event.request.json() as { code: string };
    const referrer = event.request.headers.get('referer') ?? '';

    const result = await authorize({ code, referrer });

    const cookieHeader = result.isAuthorized
      ? {
        'Set-Cookie': event.cookies.serialize(
          AUTH_COOKIE_NAME,
          JSON.stringify(result),
          {
            httpOnly: true,
            secure: true,
            maxAge: result.expiresAt ?? 0,
            path: '/',
          },
        ),
      }
      : {} as Record<string, string>;

    return new Response(JSON.stringify(result), {
      headers: { ...cookieHeader },
    });
  }

  return await resolve(event);
};
