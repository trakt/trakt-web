import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Short URL: /users/:user redirects to that user's profile.
// Done in load (not a client-side <Redirect> onMount) so the redirect
// resolves before mount. A client goto here races the goto FilterProvider
// fires on first load, which aborts it and leaves a blank page.
// Query params are preserved across the redirect.
export const load: PageLoad = ({ params, url }) => {
  const target = UrlBuilder.profile.user(params.user);

  return redirect(307, `${target}${url.search}`);
};
