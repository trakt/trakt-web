import { episodeSummaryQuery } from '$lib/requests/queries/episode/episodeSummaryQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { shouldPrefetch } from '$lib/utils/requests/shouldPrefetch.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '$types/shows/[slug]/seasons/[season]/episodes/[episode]/$types.d.ts';

export const load: PageLoad = async ({ parent, params, fetch, url }) => {
  const { queryClient, isBot } = await parent();

  const slug = assertDefined(params.slug, 'Slug is required');
  const season = parseInt(assertDefined(params.season, 'Season is required'));
  const episode = parseInt(
    assertDefined(params.episode, 'Episode is required'),
  );

  // Humans get the episode drawer on the show page. The canonical route stays
  // server-rendered for crawlers so its SEO/OG surface (via TraktPage) is intact.
  if (!isBot) {
    redirect(307, UrlBuilder.episodeDrawer(slug, season, episode));
  }

  if (shouldPrefetch({ isBot, url })) {
    await queryClient.prefetchQuery(
      episodeSummaryQuery({
        slug,
        episode,
        season,
        fetch,
      }),
    );
  }
};
