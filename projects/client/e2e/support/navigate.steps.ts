import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestId } from '../models/TestId.ts';
import { TestUrlBuilder } from '../utils/TestUrlBuilder.ts';
import { TraktWorld } from '../world.ts';

// TODO - figure out custom parameters
When(
  'I click on the {string} button',
  async function (this: TraktWorld, testId: TestId) {
    const button = this.page.getByTestId(testId);

    await button.click();
  },
);

Then(
  'I should see {string} in the page title',
  async function (this: TraktWorld, title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title));
  },
);

When(
  'I view the show summary of {string}',
  async function (this: TraktWorld, slug: string) {
    await this.page.goto(TestUrlBuilder.showSummary(slug));
  },
);

When(
  'I view the movie summary of {string}',
  async function (this: TraktWorld, slug: string) {
    await this.page.goto(TestUrlBuilder.movieSummary(slug));
  },
);

When(
  'I open the shows section',
  async function (this: TraktWorld) {
    await this.page.goto(TestUrlBuilder.shows());
  },
);

When(
  'I open the movies section',
  async function (this: TraktWorld) {
    await this.page.goto(TestUrlBuilder.movies());
  },
);

Then(
  'I should see the {string} element on the page',
  async function (this: TraktWorld, testId: TestId) {
    const element = this.page.getByTestId(testId);
    await expect(element).toBeVisible();
  },
);

Then(
  'I should not see the {string} element on the page',
  async function (this: TraktWorld, testId: TestId) {
    const element = this.page.getByTestId(testId);
    await expect(element).not.toBeVisible();
  },
);
