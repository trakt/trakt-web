import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery';
import { assertDefined } from '$lib/utils/assert/assertDefined';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      episodeSummaryQuery({
        slug: assertDefined(params.slug, 'Slug is required'),
        episode: parseInt(assertDefined(params.episode, 'Episode is required')),
        season: parseInt(assertDefined(params.season, 'Season is required')),
        fetch,
      }),
    );
  }
};
