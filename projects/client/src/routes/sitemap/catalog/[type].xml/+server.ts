import { buildUrlSet } from '$lib/features/seo/buildUrlSet.ts';
import { CATALOG_SITEMAP_CONFIG } from '$lib/features/seo/catalogSitemapConfig.ts';
import { fetchCatalogSlugs } from '$lib/features/seo/fetchCatalogSlugs.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import { toCatalogMediaType } from '$lib/features/seo/toCatalogMediaType.ts';
import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, params }) => {
  const type = toCatalogMediaType(params.type ?? '');

  if (type == null) {
    error(404);
  }

  const slugs = await fetchCatalogSlugs({ fetch, type });
  const lastmod = new Date().toISOString().split('T')[0]!;

  const body = buildUrlSet({
    origin: SEO_ORIGIN,
    entries: slugs.map((slug) => ({
      path: `/${type}s/${slug}`,
      priority: CATALOG_SITEMAP_CONFIG.priority,
      changefreq: CATALOG_SITEMAP_CONFIG.changefreq,
    })),
    lastmod,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
