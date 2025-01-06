import { isAuthorized } from '$lib/features/auth/utils/isAuthorized.ts';
import { buildOAuthUrl } from '$lib/utils/url/buildOAuthLink.ts';
import { isBotAgent } from '$lib/utils/url/isBotAgent';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (
  { request, locals },
) => {
  const requestUrl = new URL(request.url);

  const defaultResponse = {
    theme: locals.theme,
    auth: {
      url: buildOAuthUrl(TRAKT_CLIENT_ID, requestUrl.origin),
      isAuthorized: isAuthorized(locals),
    },
    isBot: isBotAgent(request.headers.get('user-agent')),
  };

  return defaultResponse;
};
