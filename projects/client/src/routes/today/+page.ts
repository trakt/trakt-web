import { browser } from '$app/environment';
import { redirectForAudience } from '$lib/features/auth/redirectForAudience.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, url }) => {
  if (browser) return;

  const { oidcAuth } = await parent();

  redirectForAudience({
    audience: 'authenticated',
    hasSession: oidcAuth.hasSession,
    search: url.search,
  });
};
