import { AUTH_COOKIE_NAME } from '$lib/features/auth/constants.ts';
import type { Handle } from '@sveltejs/kit';
import { AuthEndpoint } from './AuthEndpoint.ts';
import { authorize } from './requests/authorize.ts';
import { initiateDeviceAuth } from './requests/initiateDeviceAuth.ts';

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(AuthEndpoint.Initiate)) {
    const result = await initiateDeviceAuth();
    return new Response(JSON.stringify(result));
  }

  if (event.url.pathname.startsWith(AuthEndpoint.Verify)) {
    const { code } = await event.request.json() as { code: string };
    const result = await authorize(code);

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
