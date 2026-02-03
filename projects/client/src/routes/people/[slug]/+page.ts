import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { PageLoad } from '$types/people/[slug]/$types.d.ts';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      peopleSummaryQuery({
        slug: assertDefined(params.slug, 'Slug is required'),
        fetch,
      }),
    );
  }
};
