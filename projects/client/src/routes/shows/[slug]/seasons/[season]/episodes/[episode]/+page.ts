import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { PageLoad } from '$types/shows/[slug]/seasons/[season]/episodes/[episode]/$types.d.ts';

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
