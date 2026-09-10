import { buildRobotsTxt } from '$lib/features/seo/buildRobotsTxt.ts';
import { CRAWL_BLOCKED_PARAMS } from '$lib/features/seo/crawlBlockedParams.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import type { RequestHandler } from '@sveltejs/kit';

const DISALLOWED_PATHS: readonly string[] = [
  '/calendar',
  '/history',
  '/settings',
  '/social',
  '/callback',
  '/silent-redirect',
  '/api/',
  '/_design_system',
];

export const GET: RequestHandler = () => {
  const body = buildRobotsTxt({
    disallowedPaths: DISALLOWED_PATHS,
    blockedParams: CRAWL_BLOCKED_PARAMS,
    sitemapUrl: `${SEO_ORIGIN}/sitemap.xml`,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
