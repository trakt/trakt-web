import { redirectForAudience } from '$lib/features/auth/redirectForAudience.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) =>
  redirectForAudience({
    audience: 'public',
    oidcAuth: locals.oidcAuth,
    search: url.search,
  });
