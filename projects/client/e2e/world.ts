import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
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

  async init() {
    this._browser = await chromium.launch({ headless: E2E_HEADLESS });
    this._context = await this._browser.newContext();
    this._page = await this._context.newPage();

    await this._page.goto(E2E_BASE_URL);
  }

  async close() {
    await this._page?.close();
    await this._context?.close();
    await this._browser?.close();
  }
}

setWorldConstructor(TraktWorld);

Before(async function (this: TraktWorld) {
  await this.init();
});

After(async function (this: TraktWorld) {
  await this.close();
});
