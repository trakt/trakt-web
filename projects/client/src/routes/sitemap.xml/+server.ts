import { buildSitemapIndex } from '$lib/features/seo/buildSitemapIndex.ts';
import { catalogSitemapPaths } from '$lib/features/seo/catalogSitemapPaths.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () => {
  const lastmod = new Date().toISOString().split('T')[0]!;

  const body = buildSitemapIndex({
    origin: SEO_ORIGIN,
    paths: ['/sitemap/pages.xml', ...catalogSitemapPaths()],
    lastmod,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
