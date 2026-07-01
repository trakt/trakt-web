import { getYearInReviewYear } from '$lib/utils/date/getYearInReviewYear.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Short URL: /users/:user/yir redirects to that user's year in review.
// During January and February the previous year is used, since the current
// year has barely any data yet.
// Query params (e.g. ?embedded_mode&slurm=1) are preserved across the redirect.
export const load: PageLoad = ({ params, url }) => {
  const year = getYearInReviewYear(new Date());

  const target = UrlBuilder.users(params.user).yearToDate(year);

  return redirect(307, `${target}${url.search}`);
};
