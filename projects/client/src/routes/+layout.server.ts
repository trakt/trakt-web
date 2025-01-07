import { AUTH_COOKIE_NAME } from '$lib/features/auth/constants';
import { buildOAuthUrl } from '$lib/utils/url/buildOAuthLink.ts';
import { isBotAgent } from '$lib/utils/url/isBotAgent';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (
  { cookies, request, locals: { theme, auth } },
) => {
  const requestUrl = new URL(request.url);

  const defaultResponse = {
    theme,
    auth: {
      url: buildOAuthUrl(TRAKT_CLIENT_ID, requestUrl.origin),
      token: null as string | Nil,
    },
    isBot: isBotAgent(request.headers.get('user-agent')),
  };

  if (!auth) {
    cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
    return defaultResponse;
  }

  defaultResponse.auth.token = auth.token.access;

  return defaultResponse;
};
