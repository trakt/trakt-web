import { unauthorizedApi } from '$lib/requests/api.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { CATALOG_SITEMAP_CONFIG } from './catalogSitemapConfig.ts';

type FetchCatalogSlugsParams = {
  fetch: typeof fetch;
  type: MediaType;
};

export async function fetchCatalogSlugs({
  fetch,
  type,
}: FetchCatalogSlugsParams): Promise<string[]> {
  const { entriesPerPage, maxPages } = CATALOG_SITEMAP_CONFIG;
  const api = unauthorizedApi({ fetch });

  const requestPage = (page: number) => {
    const query = { page, limit: entriesPerPage };

    return type === 'movie'
      ? api.movies.popular({ query })
      : api.shows.popular({ query });
  };

  const firstResponse = await requestPage(1);
  if (firstResponse.status !== 200) return [];

  const pageCount = Number(
    firstResponse.headers.get('x-pagination-page-count') ?? 1,
  );
  const remainingPages = Number.isInteger(pageCount)
    ? Math.min(pageCount, maxPages) - 1
    : 0;

  const remainingResponses = await Promise.all(
    Array.from(
      { length: Math.max(remainingPages, 0) },
      (_, index) => requestPage(index + 2),
    ),
  );

  return [firstResponse, ...remainingResponses]
    .filter((response) => response.status === 200)
    .flatMap((response) => response.body.map((entry) => entry.ids.slug));
}
