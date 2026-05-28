import { Then } from '@cucumber/cucumber';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { TraktWorld } from '../world.ts';

function metaContent(page: Page, selector: string): Promise<string> {
  return page.$eval(selector, (el) => el.getAttribute('content') ?? '');
}

// During SvelteKit client-side navigation, the outgoing page's <svelte:head>
// briefly coexists with the incoming one, producing two matching meta elements.
// .last() always selects the incoming (correct) element.
function metaLocator(page: Page, selector: string) {
  return page.locator(selector).last();
}

// The JSON-LD script tag may be temporarily absent during client-side navigation.
// The try/catch allows expect.poll to retry gracefully instead of throwing immediately.
async function getJsonLd(page: Page): Promise<Record<string, unknown>> {
  try {
    const text = await page.$eval(
      'script[type="application/ld+json"]',
      (el) => el.textContent ?? '',
    );
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
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
    await expect(metaLocator(this.page, 'meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    );
  },
);

Then(
  'the og:type should be {string}',
  async function (this: TraktWorld, expectedType: string) {
    await expect(
      metaLocator(this.page, 'meta[property="og:type"]'),
    ).toHaveAttribute('content', expectedType);
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
    await expect(
      metaLocator(this.page, 'meta[property="og:title"]'),
    ).toHaveAttribute('content', expectedTitle);
    await expect(
      metaLocator(this.page, 'meta[name="twitter:title"]'),
    ).toHaveAttribute('content', expectedTitle);
  },
);

Then(
  'the description should be {string}',
  async function (this: TraktWorld, expectedDescription: string) {
    await expect(
      metaLocator(this.page, 'meta[name="description"]'),
    ).toHaveAttribute('content', expectedDescription);
    await expect(
      metaLocator(this.page, 'meta[property="og:description"]'),
    ).toHaveAttribute('content', expectedDescription);
    await expect(
      metaLocator(this.page, 'meta[name="twitter:description"]'),
    ).toHaveAttribute('content', expectedDescription);
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

    await expect(
      metaLocator(this.page, 'meta[property="og:title"]'),
    ).toHaveAttribute('content', visibleTitle);
    await expect(
      metaLocator(this.page, 'meta[name="twitter:title"]'),
    ).toHaveAttribute('content', visibleTitle);
  },
);

Then(
  'the page title should contain the og:title',
  async function (this: TraktWorld) {
    const ogTitle =
      (await metaLocator(this.page, 'meta[property="og:title"]').getAttribute(
        'content',
      )) ?? '';
    const escapedTitle = ogTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveTitle(new RegExp(escapedTitle));
  },
);

Then(
  'the og:image should be an absolute URL',
  async function (this: TraktWorld) {
    await expect(
      metaLocator(this.page, 'meta[property="og:image"]'),
    ).toHaveAttribute('content', /^https?:\/\/.+/);
    await expect(
      metaLocator(this.page, 'meta[name="twitter:image"]'),
    ).toHaveAttribute('content', /^https?:\/\/.+/);
  },
);

Then(
  'the og:image dimensions should be 1200 by 630',
  async function (this: TraktWorld) {
    await expect(
      metaLocator(this.page, 'meta[property="og:image:width"]'),
    ).toHaveAttribute('content', '1200');
    await expect(
      metaLocator(this.page, 'meta[property="og:image:height"]'),
    ).toHaveAttribute('content', '630');
  },
);

Then(
  'the JSON-LD should include a search action',
  async function (this: TraktWorld) {
    await expect.poll(async () => {
      const jsonLd = await getJsonLd(this.page);
      const action = jsonLd['potentialAction'] as
        | Record<string, unknown>
        | undefined;
      const target = action?.['target'] as Record<string, unknown> | undefined;
      return String(target?.['urlTemplate'] ?? '');
    }).toMatch(/search.*search_term_string/);

    const jsonLd = await getJsonLd(this.page);
    const action = jsonLd['potentialAction'] as
      | Record<string, unknown>
      | undefined;
    expect(action?.['@type'], 'potentialAction @type').toBe('SearchAction');
  },
);

Then(
  'the JSON-LD should include genre and year',
  async function (this: TraktWorld) {
    await expect.poll(async () => {
      const jsonLd = await getJsonLd(this.page);
      const genres = jsonLd['genre'];
      return Array.isArray(genres) ? genres.length : 0;
    }).toBeGreaterThan(0);

    await expect.poll(async () => {
      const jsonLd = await getJsonLd(this.page);
      return String(jsonLd['datePublished'] ?? '');
    }).toMatch(/^\d{4}$/);
  },
);

Then(
  'the JSON-LD should be of type {string}',
  async function (this: TraktWorld, schemaType: string) {
    await expect.poll(() =>
      getJsonLd(this.page).then((jsonLd) => jsonLd['@type'])
    ).toBe(schemaType);

    const jsonLd = await getJsonLd(this.page);
    expect(jsonLd['@context'], 'JSON-LD @context').toBe('https://schema.org');
  },
);

Then(
  'the JSON-LD name should match the og:title',
  async function (this: TraktWorld) {
    const ogTitle =
      (await metaLocator(this.page, 'meta[property="og:title"]').getAttribute(
        'content',
      )) ?? '';

    await expect.poll(() =>
      getJsonLd(this.page).then((jsonLd) => String(jsonLd['name'] ?? ''))
    ).toBe(ogTitle);
  },
);
