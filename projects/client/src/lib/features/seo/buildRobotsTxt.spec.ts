import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';
import { describe, expect, it } from 'vitest';
import { buildRobotsTxt } from './buildRobotsTxt.ts';
import { CRAWL_BLOCKED_PARAMS } from './crawlBlockedParams.ts';

describe('util: buildRobotsTxt', () => {
  const build = () =>
    buildRobotsTxt({
      disallowedPaths: ['/settings'],
      blockedParams: CRAWL_BLOCKED_PARAMS,
      sitemapUrl: 'https://app.trakt.tv/sitemap.xml',
    });

  it('should open with a wildcard user agent that allows the root', () => {
    expect(build()).to.include('User-agent: *\nAllow: /\n');
  });

  it('should disallow every path it is given', () => {
    expect(build()).to.include('Disallow: /settings');
  });

  it('should disallow a query parameter anywhere in the query string', () => {
    expect(build()).to.include('Disallow: /*?*mode=');
  });

  it('should disallow every filter key', () => {
    const robots = build();

    for (const key of FILTER_KEYS) {
      expect(robots).to.include(`Disallow: /*?*${key}=`);
    }
  });

  it('should disallow the drawer, credit and cache-bust parameters', () => {
    const robots = build();

    for (const param of ['view', 'season', 'episode', 'shows', '_cb']) {
      expect(robots).to.include(`Disallow: /*?*${param}=`);
    }
  });

  it('should point at the sitemap', () => {
    expect(build()).to.include('Sitemap: https://app.trakt.tv/sitemap.xml');
  });

  it('should not block the search query parameter', () => {
    expect(build()).to.not.include('Disallow: /*?*q=');
  });
});
