import { movieSummaryQuery } from '$lib/requests/queries/movies/movieSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { PageLoad } from '$types/movies/[slug]/$types.d.ts';

export const load: PageLoad = async ({ parent, params, fetch }) => {
  const { queryClient, isBot } = await parent();

  if (isBot) {
    await queryClient.prefetchQuery(
      movieSummaryQuery({
        slug: assertDefined(params.slug, 'Slug is required'),
        fetch,
      }),
    );
  }
};
