import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestId } from '../models/TestId.ts';
import { TraktWorld } from '../world.ts';

// TODO - figure out custom parameters
When(
  'I click on the {string} button',
  async function (this: TraktWorld, testId: TestId) {
    const moviesButton = this.page.getByTestId(testId);

    await moviesButton.click();
  },
);

Then(
  'I should see {string} in the page title',
  async function (this: TraktWorld, title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title));
  },
);
