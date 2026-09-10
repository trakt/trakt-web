import { describe, expect, it } from 'vitest';
import { buildUrlSet } from './buildUrlSet.ts';

describe('util: buildUrlSet', () => {
  const build = () =>
    buildUrlSet({
      origin: 'https://app.trakt.tv',
      entries: [
        { path: '/shows/silo', priority: '0.6', changefreq: 'weekly' },
        { path: '/movies/a&b', priority: '0.6', changefreq: 'weekly' },
      ],
      lastmod: '2026-09-10',
    });

  it('should declare the sitemap namespace', () => {
    expect(build()).to.include(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    );
  });

  it('should prefix every path with the origin', () => {
    expect(build()).to.include('<loc>https://app.trakt.tv/shows/silo</loc>');
  });

  it('should escape xml entities in the location', () => {
    expect(build()).to.include(
      '<loc>https://app.trakt.tv/movies/a&amp;b</loc>',
    );
  });

  it('should carry the lastmod, changefreq and priority', () => {
    const urlSet = build();

    expect(urlSet).to.include('<lastmod>2026-09-10</lastmod>');
    expect(urlSet).to.include('<changefreq>weekly</changefreq>');
    expect(urlSet).to.include('<priority>0.6</priority>');
  });

  it('should emit one url node per entry', () => {
    expect(build().match(/<url>/g)).to.have.length(2);
  });
});
