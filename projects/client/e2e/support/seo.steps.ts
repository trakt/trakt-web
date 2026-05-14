import { Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { TraktWorld } from '../world.ts';

function metaContent(page: Page, selector: string): Promise<string> {
  return page.$eval(selector, (el) => el.getAttribute('content') ?? '');
}

Then(
  'the page should meet core SEO requirements',
  async function (this: TraktWorld) {
    const page = this.page;

    await expect(page).toHaveTitle(/Trakt Web/);

    const canonical = await page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute('href') ?? '',
    );
    const { origin, pathname } = new URL(page.url());
    expect(canonical, 'canonical should match origin + pathname').toBe(
      `${origin}${pathname}`,
    );

    const description = await metaContent(page, 'meta[name="description"]');
    expect(description.length, 'description should not be empty')
      .toBeGreaterThan(0);

    const [ogTitle, ogDescription, ogImage, ogUrl, ogSiteName, ogLocale] =
      await Promise.all([
        metaContent(page, 'meta[property="og:title"]'),
        metaContent(page, 'meta[property="og:description"]'),
        metaContent(page, 'meta[property="og:image"]'),
        metaContent(page, 'meta[property="og:url"]'),
        metaContent(page, 'meta[property="og:site_name"]'),
        metaContent(page, 'meta[property="og:locale"]'),
      ]);

    expect(ogTitle.length, 'og:title should not be empty').toBeGreaterThan(0);
    expect(ogDescription.length, 'og:description should not be empty')
      .toBeGreaterThan(0);
    expect(ogImage.length, 'og:image should not be empty').toBeGreaterThan(0);
    expect(ogUrl, 'og:url should match canonical').toBe(canonical);
    expect(ogSiteName, 'og:site_name').toBe('Trakt Web');
    expect(ogLocale, 'og:locale should match language_REGION format').toMatch(
      /^[a-z]{2}_[A-Z]{2}$/,
    );

    const [
      twitterCard,
      twitterSite,
      twitterTitle,
      twitterImage,
      twitterDescription,
    ] = await Promise.all([
      metaContent(page, 'meta[name="twitter:card"]'),
      metaContent(page, 'meta[name="twitter:site"]'),
      metaContent(page, 'meta[name="twitter:title"]'),
      metaContent(page, 'meta[name="twitter:image"]'),
      metaContent(page, 'meta[name="twitter:description"]'),
    ]);

    expect(twitterCard, 'twitter:card').toBe('summary_large_image');
    expect(twitterSite, 'twitter:site').toBe('@trakt');
    expect(twitterTitle, 'twitter:title should match og:title').toBe(ogTitle);
    expect(twitterImage.length, 'twitter:image should not be empty')
      .toBeGreaterThan(0);
    expect(
      twitterDescription,
      'twitter:description should match og:description',
    ).toBe(
      ogDescription,
    );
  },
);

Then(
  'the page should not be blocked from indexing',
  async function (this: TraktWorld) {
    const robots = await metaContent(this.page, 'meta[name="robots"]');
    expect(robots, 'robots directive').toBe('index, follow');
  },
);

Then(
  'the og:type should be {string}',
  async function (this: TraktWorld, expectedType: string) {
    const ogType = await metaContent(this.page, 'meta[property="og:type"]');
    expect(ogType, 'og:type').toBe(expectedType);
  },
);

Then(
  'the page title should be {string}',
  async function (this: TraktWorld, expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  },
);

Then(
  'the og:title should be {string}',
  async function (this: TraktWorld, expectedTitle: string) {
    const [ogTitle, twitterTitle] = await Promise.all([
      metaContent(this.page, 'meta[property="og:title"]'),
      metaContent(this.page, 'meta[name="twitter:title"]'),
    ]);
    expect(ogTitle, 'og:title').toBe(expectedTitle);
    expect(twitterTitle, 'twitter:title should match og:title').toBe(
      expectedTitle,
    );
  },
);

Then(
  'the description should be {string}',
  async function (this: TraktWorld, expectedDescription: string) {
    const [description, ogDescription, twitterDescription] = await Promise.all([
      metaContent(this.page, 'meta[name="description"]'),
      metaContent(this.page, 'meta[property="og:description"]'),
      metaContent(this.page, 'meta[name="twitter:description"]'),
    ]);
    expect(description, 'description').toBe(expectedDescription);
    expect(ogDescription, 'og:description').toBe(expectedDescription);
    expect(twitterDescription, 'twitter:description').toBe(expectedDescription);
  },
);

Then(
  'the canonical path should be {string}',
  async function (this: TraktWorld, expectedPath: string) {
    const canonical = await this.page.$eval(
      'link[rel="canonical"]',
      (el) => el.getAttribute('href') ?? '',
    );
    const { pathname } = new URL(canonical);
    expect(pathname, 'canonical path').toBe(expectedPath);
  },
);

Then(
  'the og:title should match the visible media title',
  async function (this: TraktWorld) {
    const titleEl = this.page.getByTestId('summary-media-title');
    await expect(titleEl).toBeVisible();
    const visibleTitle = (await titleEl.textContent() ?? '').trim();

    const [ogTitle, twitterTitle] = await Promise.all([
      metaContent(this.page, 'meta[property="og:title"]'),
      metaContent(this.page, 'meta[name="twitter:title"]'),
    ]);
    expect(ogTitle.trim(), 'og:title should match visible media title').toBe(
      visibleTitle,
    );
    expect(
      twitterTitle.trim(),
      'twitter:title should match visible media title',
    ).toBe(
      visibleTitle,
    );
  },
);

Then(
  'the page title should contain the og:title',
  async function (this: TraktWorld) {
    const ogTitle = await metaContent(this.page, 'meta[property="og:title"]');
    const escapedTitle = ogTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveTitle(new RegExp(escapedTitle));
  },
);

Then(
  'the og:image should be an absolute URL',
  async function (this: TraktWorld) {
    const [ogImage, twitterImage] = await Promise.all([
      metaContent(this.page, 'meta[property="og:image"]'),
      metaContent(this.page, 'meta[name="twitter:image"]'),
    ]);
    expect(ogImage, 'og:image should be an absolute URL').toMatch(
      /^https?:\/\/.+/,
    );
    expect(twitterImage, 'twitter:image should be an absolute URL').toMatch(
      /^https?:\/\/.+/,
    );
  },
);

Then(
  'the og:image dimensions should be 1200 by 630',
  async function (this: TraktWorld) {
    const [width, height] = await Promise.all([
      this.page.$eval(
        'meta[property="og:image:width"]',
        (el) => el.getAttribute('content') ?? '',
      ),
      this.page.$eval(
        'meta[property="og:image:height"]',
        (el) => el.getAttribute('content') ?? '',
      ),
    ]);
    expect(width, 'og:image:width').toBe('1200');
    expect(height, 'og:image:height').toBe('630');
  },
);

Then(
  'the JSON-LD should include a search action',
  async function (this: TraktWorld) {
    const jsonLdText = await this.page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    );
    const jsonLd = JSON.parse(jsonLdText) as Record<string, unknown>;
    const action = jsonLd['potentialAction'] as
      | Record<string, unknown>
      | undefined;
    expect(action, 'JSON-LD potentialAction should be present').toBeDefined();
    expect(action?.['@type'], 'potentialAction @type').toBe('SearchAction');
    const target = action?.['target'] as Record<string, unknown> | undefined;
    expect(String(target?.['urlTemplate'] ?? ''), 'SearchAction urlTemplate')
      .toMatch(
        /search.*search_term_string/,
      );
  },
);

Then(
  'the JSON-LD should include genre and year',
  async function (this: TraktWorld) {
    const jsonLdText = await this.page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    );
    const jsonLd = JSON.parse(jsonLdText) as Record<string, unknown>;
    const genres = jsonLd['genre'];
    expect(genres, 'JSON-LD genre should be present').toBeDefined();
    expect(
      Array.isArray(genres) ? genres.length : 0,
      'JSON-LD genre should be non-empty',
    ).toBeGreaterThan(0);
    const datePublished = jsonLd['datePublished'];
    expect(datePublished, 'JSON-LD datePublished should be present')
      .toBeDefined();
    expect(
      String(datePublished ?? ''),
      'JSON-LD datePublished should be a year',
    ).toMatch(/^\d{4}$/);
  },
);

Then(
  'the JSON-LD should be of type {string}',
  async function (this: TraktWorld, schemaType: string) {
    const jsonLdText = await this.page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    );
    const jsonLd = JSON.parse(jsonLdText) as Record<string, unknown>;
    expect(jsonLd['@context'], 'JSON-LD @context').toBe('https://schema.org');
    expect(jsonLd['@type'], 'JSON-LD @type').toBe(schemaType);
  },
);

Then(
  'the JSON-LD name should match the og:title',
  async function (this: TraktWorld) {
    const ogTitle = await metaContent(this.page, 'meta[property="og:title"]');
    const jsonLdText = await this.page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    );
    const jsonLd = JSON.parse(jsonLdText) as Record<string, unknown>;
    expect(String(jsonLd['name']), 'JSON-LD name should match og:title').toBe(
      ogTitle,
    );
  },
);
