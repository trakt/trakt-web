import { buildUrlSet } from '$lib/features/seo/buildUrlSet.ts';
import { SEO_ORIGIN } from '$lib/features/seo/seoOrigin.ts';
import type { SitemapEntry } from '$lib/features/seo/SitemapEntry.ts';
import type { RequestHandler } from '@sveltejs/kit';

const STATIC_ROUTES: ReadonlyArray<SitemapEntry> = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/movies', priority: '0.9', changefreq: 'daily' },
  { path: '/movies/popular', priority: '0.8', changefreq: 'daily' },
  { path: '/movies/trending', priority: '0.8', changefreq: 'hourly' },
  { path: '/movies/anticipated', priority: '0.7', changefreq: 'weekly' },
  { path: '/movies/recommended', priority: '0.7', changefreq: 'daily' },
  { path: '/shows', priority: '0.9', changefreq: 'daily' },
  { path: '/shows/popular', priority: '0.8', changefreq: 'daily' },
  { path: '/shows/trending', priority: '0.8', changefreq: 'hourly' },
  { path: '/shows/anticipated', priority: '0.7', changefreq: 'weekly' },
  { path: '/shows/recommended', priority: '0.7', changefreq: 'daily' },
  { path: '/media/popular', priority: '0.7', changefreq: 'daily' },
  { path: '/media/trending', priority: '0.7', changefreq: 'hourly' },
  { path: '/media/anticipated', priority: '0.7', changefreq: 'weekly' },
  { path: '/media/recommended', priority: '0.7', changefreq: 'daily' },
  { path: '/discover', priority: '0.8', changefreq: 'daily' },
  { path: '/search', priority: '0.6', changefreq: 'monthly' },
  { path: '/vip', priority: '0.5', changefreq: 'monthly' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

export const GET: RequestHandler = () => {
  const lastmod = new Date().toISOString().split('T')[0]!;

  const body = buildUrlSet({
    origin: SEO_ORIGIN,
    entries: STATIC_ROUTES,
    lastmod,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
