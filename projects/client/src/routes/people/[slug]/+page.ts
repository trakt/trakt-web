import { browser } from '$app/environment';
import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { shouldPrefetch } from '$lib/utils/requests/shouldPrefetch.ts';
import type { PageLoad } from '$types/people/[slug]/$types.d.ts';

export const load: PageLoad = async ({ parent, params, fetch, url }) => {
  const { queryClient, isBot } = await parent();

  const slug = assertDefined(params.slug, 'Slug is required');

  if (shouldPrefetch({ isBot, url })) {
    await queryClient.prefetchQuery(peopleSummaryQuery({ slug, fetch }));
    return;
  }

  if (browser) {
    void queryClient.prefetchQuery(peopleSummaryQuery({ slug }));
  }
};
