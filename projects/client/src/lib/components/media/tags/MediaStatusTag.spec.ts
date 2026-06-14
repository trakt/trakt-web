import { time } from '$lib/utils/timing/time.ts';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import MediaStatusTag from './MediaStatusTag.svelte';
import { TagIntlProvider } from './TagIntlProvider.ts';

describe('MediaStatusTag', () => {
  test('it renders the new tag when status is released and effectiveReleaseDate is in the future', () => {
    const tomorrow = new Date(Date.now() + time.days(1));

    render(
      MediaStatusTag,
      {
        props: {
          i18n: TagIntlProvider,
          status: 'released',
          effectiveReleaseDate: tomorrow,
        },
      },
    );

    expect(screen.getByText(TagIntlProvider.newLabel())).toBeInTheDocument();
  });

  test('it renders the new tag when effectiveReleaseDate is within the past 7 days', () => {
    const threeDaysAgo = new Date(Date.now() - time.days(3));

    render(
      MediaStatusTag,
      {
        props: {
          i18n: TagIntlProvider,
          status: 'released',
          effectiveReleaseDate: threeDaysAgo,
        },
      },
    );

    expect(screen.getByText(TagIntlProvider.newLabel())).toBeInTheDocument();
  });

  test('it does not render the new tag when effectiveReleaseDate is older than 7 days', () => {
    const tenDaysAgo = new Date(Date.now() - time.days(10));

    render(
      MediaStatusTag,
      {
        props: {
          i18n: TagIntlProvider,
          status: 'released',
          effectiveReleaseDate: tenDaysAgo,
        },
      },
    );

    expect(screen.queryByText(TagIntlProvider.newLabel()))
      .not.toBeInTheDocument();
  });

  test('it does not render the new tag for future-dated media that is not yet released', () => {
    const tomorrow = new Date(Date.now() + time.days(1));

    render(
      MediaStatusTag,
      {
        props: {
          i18n: TagIntlProvider,
          status: 'post production',
          effectiveReleaseDate: tomorrow,
        },
      },
    );

    expect(screen.queryByText(TagIntlProvider.newLabel()))
      .not.toBeInTheDocument();
  });
});
