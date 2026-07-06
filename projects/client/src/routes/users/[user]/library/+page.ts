import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// The library is only viewable for the authenticated user's own account
// (the `me` alias). Guard in load so the redirect resolves before mount — a
// client-side <Redirect> here races the goto FilterProvider fires on first
// load, which aborts it and leaves a blank page.
export const load: PageLoad = ({ params }) => {
  if (params.user !== 'me') {
    return redirect(307, UrlBuilder.home());
  }
};
