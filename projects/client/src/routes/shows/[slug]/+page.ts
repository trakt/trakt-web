import { showSummaryQuery } from '$lib/requests/queries/shows/showSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      showSummaryQuery({
        slug: assertDefined(params.slug, 'Slug is required'),
        fetch,
      }),
    );
  }
};
