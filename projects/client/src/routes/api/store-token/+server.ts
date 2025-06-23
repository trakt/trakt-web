import { OIDC_AUTH_COOKIE_NAME } from '$lib/features/auth/handle.ts';
import type { OidcAuthToken } from '$lib/features/auth/models/OidcAuthToken.ts';
import { IS_PROD } from '$lib/utils/env/index.ts';
import { time } from '$lib/utils/timing/time.ts';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { token, expiresAt }: OidcAuthToken = await request.json();

  const maxAge = expiresAt
    ? expiresAt - Math.floor(Date.now() / time.seconds(1))
    : 0;
  const cookieContent = JSON.stringify({ token, expiresAt });

  cookies.set(OIDC_AUTH_COOKIE_NAME, cookieContent, {
    path: '/',
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge,
  });

  return json({ ok: true });
};
