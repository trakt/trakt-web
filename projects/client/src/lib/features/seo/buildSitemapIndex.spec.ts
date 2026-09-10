import { describe, expect, it } from 'vitest';
import { buildSitemapIndex } from './buildSitemapIndex.ts';

describe('util: buildSitemapIndex', () => {
  const build = () =>
    buildSitemapIndex({
      origin: 'https://app.trakt.tv',
      paths: ['/sitemap/pages.xml', '/sitemap/shows/1.xml'],
      lastmod: '2026-09-10',
    });

  it('should declare the sitemap index namespace', () => {
    expect(build()).to.include(
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
  });

  it('should emit one sitemap node per path', () => {
    expect(build().match(/<sitemap>/g)).to.have.length(2);
  });

  it('should prefix every path with the origin', () => {
    expect(build()).to.include(
      '<loc>https://app.trakt.tv/sitemap/shows/1.xml</loc>',
    );
  });
});
