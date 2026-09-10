import type { SitemapEntry } from './SitemapEntry.ts';
import { escapeXml } from './escapeXml.ts';

type BuildUrlSetParams = {
  origin: string;
  entries: readonly SitemapEntry[];
  lastmod: string;
};

export function buildUrlSet(
  { origin, entries, lastmod }: BuildUrlSetParams,
): string {
  const urls = entries
    .map(({ path, priority, changefreq }) =>
      `  <url>
    <loc>${escapeXml(`${origin}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
