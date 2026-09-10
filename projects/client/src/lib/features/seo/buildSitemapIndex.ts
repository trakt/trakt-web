import { escapeXml } from './escapeXml.ts';

type BuildSitemapIndexParams = {
  origin: string;
  paths: readonly string[];
  lastmod: string;
};

export function buildSitemapIndex(
  { origin, paths, lastmod }: BuildSitemapIndexParams,
): string {
  const sitemaps = paths
    .map((path) =>
      `  <sitemap>
    <loc>${escapeXml(`${origin}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}
