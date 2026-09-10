import { describe, expect, it } from 'vitest';
import { catalogSitemapPaths } from './catalogSitemapPaths.ts';

describe('util: catalogSitemapPaths', () => {
  it('should emit one catalog sitemap per media type', () => {
    expect(catalogSitemapPaths()).to.deep.equal([
      '/sitemap/catalog/movies.xml',
      '/sitemap/catalog/shows.xml',
    ]);
  });
});
