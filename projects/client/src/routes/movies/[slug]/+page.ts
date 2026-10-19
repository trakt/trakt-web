import { browser } from '$app/environment';
import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { shouldPrefetch } from '$lib/utils/requests/shouldPrefetch.ts';
import type { PageLoad } from '$types/movies/[slug]/$types.d.ts';

export const load: PageLoad = async ({ parent, params, fetch, url }) => {
  const { queryClient, isBot } = await parent();

  if (shouldPrefetch({ isBot, url })) {
    const slug = assertDefined(params.slug, 'Slug is required');
    await queryClient.prefetchQuery(movieSummaryQuery({ slug, fetch }));
    return;
  }

  if (browser && params.slug) {
    void queryClient.prefetchQuery(movieSummaryQuery({ slug: params.slug }));
  }
};
