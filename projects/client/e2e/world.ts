import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { ITestCaseHookParameter } from '@cucumber/cucumber';
import { After, Before, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import { E2E_BASE_URL, E2E_HEADLESS } from './constants/constants.ts';

export class TraktWorld extends World {
  private _page?: Page;
  private _browser?: Browser;
  private _context?: BrowserContext;

  get page(): Page {
    return assertDefined(this._page, 'init must be called first');
  }

  async init(options?: { isBot?: boolean }) {
    this._browser = await chromium.launch({ headless: E2E_HEADLESS });
    this._context = await this._browser.newContext();
    this._page = await this._context.newPage();

    const userAgent = await this._page.evaluate(() => navigator.userAgent);
    let headlessUserAgent = userAgent.replace(/headless/gi, '');
    if (options?.isBot) {
      headlessUserAgent += ' Googlebot';
    }

    await this._context.setExtraHTTPHeaders({
      'user-agent': headlessUserAgent,
    });

    await this._page.goto(E2E_BASE_URL);
  }

  async close() {
    await this._page?.close();
    await this._context?.close();
    await this._browser?.close();
  }
}

setWorldConstructor(TraktWorld);

Before(async function (this: TraktWorld, { pickle }: ITestCaseHookParameter) {
  const isBot = pickle.tags.some((tag) =>
    tag.name === '@bot' || tag.name === '@seo'
  );
  await this.init({ isBot });
});

After(async function (this: TraktWorld) {
  await this.close();
});
