import { resolveLegacyRedirect } from '$lib/features/legacy-redirects/resolveLegacyRedirect.ts';
import type { Handle } from '@sveltejs/kit';

// The v2 site (trakt.tv) is retired; its paths now land on trakt-web. Any
// legacy shape with a known trakt-web equivalent is 301'd here, before routing,
// so no auth/i18n/data work runs for a request we're about to redirect anyway.
export const handle: Handle = ({ event, resolve }) => {
  const target = resolveLegacyRedirect(event.url.pathname);

  if (!target || target === event.url.pathname) {
    return resolve(event);
  }

  const search = event.url.search;
  // Merge the incoming query string, accounting for targets (e.g. the episode
  // drawer) that already carry their own params.
  const location = search && target.includes('?')
    ? `${target}&${search.slice(1)}`
    : `${target}${search}`;

  return new Response(null, {
    status: 301,
    headers: { Location: location },
  });
};
