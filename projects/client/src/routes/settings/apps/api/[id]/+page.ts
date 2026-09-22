import { redirect } from '@sveltejs/kit';
import { isApiAppsSunset } from '$lib/sections/settings/isApiAppsSunset.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

export const load = () => {
  if (isApiAppsSunset()) {
    return redirect(307, UrlBuilder.developer.portal());
  }
};
