import { buildOpenSearchXml } from '$lib/features/seo/buildOpenSearchXml.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = () =>
  new Response(buildOpenSearchXml(SEO_ORIGIN), {
    headers: {
      'Content-Type': 'application/opensearchdescription+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
