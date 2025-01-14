import { peopleSummaryQuery } from '$lib/requests/queries/people/peopleSummaryQuery';
import { assertDefined } from '$lib/utils/assert/assertDefined';
import type { PageLoad } from './$types';

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
