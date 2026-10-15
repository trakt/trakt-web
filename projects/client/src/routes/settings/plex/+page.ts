import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';

export const load = ({ url }) =>
  redirect(301, `${UrlBuilder.settings.sync()}${url.search}`);
