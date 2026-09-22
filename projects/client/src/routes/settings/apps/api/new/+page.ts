import { redirect } from '@sveltejs/kit';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export const load = () => {
  return redirect(307, UrlBuilder.developer.newApp());
};
