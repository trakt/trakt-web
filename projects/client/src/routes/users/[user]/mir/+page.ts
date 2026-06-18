import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import { subMonths } from 'date-fns/subMonths';
import type { PageLoad } from './$types';

// Short URL: /users/:user/mir (no year/month) redirects to the previous month's review.
// Query params (e.g. ?embedded_mode&slurm=1) are preserved across the redirect.
export const load: PageLoad = ({ params, url }) => {
  const previousMonth = subMonths(new Date(), 1);
  const target = UrlBuilder.users(params.user).monthInReview(
    previousMonth.getFullYear(),
    previousMonth.getMonth() + 1,
  );

  return redirect(307, `${target}${url.search}`);
};
