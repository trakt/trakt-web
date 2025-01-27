import { time } from '$lib/utils/timing/time';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AirDateTag from './AirDateTag.svelte';
import { TagIntlProvider } from './TagIntlProvider';

describe('AirDateTag', () => {
  it('should display TBA when year is null', () => {
    render(AirDateTag, {
      props: {
        year: null,
        airDate: new Date(),
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText('TBA')).toBeDefined();
  });

  it('should the year for an earlier date', () => {
    const currentYear = new Date().getFullYear();
    const airDate = new Date(Date.now() - time.years(1));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText(`${currentYear - 1}`)).toBeDefined();
  });

  it('should display relative date if it is released in the upcoming week', () => {
    const airDate = new Date(new Date().getTime() + time.days(6));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText('in 6 days')).toBeDefined();
  });

  it('should display relative date if it is released in the upcoming month', () => {
    const airDate = new Date(new Date().getTime() + time.months(1));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText('next month')).toBeDefined();
  });

  it('should display relative date if it is released in next 3 months', () => {
    const airDate = new Date(new Date().getTime() + time.months(3));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText('in 3 months')).toBeDefined();
  });

  it('should display relative date if it is released in next 6 months', () => {
    const airDate = new Date(new Date().getTime() + time.months(6));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText('in 6 months')).toBeDefined();
  });

  it('should display the year if it is released in the upcoming year', () => {
    const currentYear = new Date().getFullYear();
    const airDate = new Date(Date.now() + time.years(1));

    render(AirDateTag, {
      props: {
        year: airDate.getFullYear(),
        airDate,
        i18n: TagIntlProvider,
      },
    });

    expect(screen.getByText(`${currentYear + 1}`)).toBeDefined();
  });

  it('should pass correct CSS variables to StemTag', () => {
    const { container } = render(AirDateTag, {
      props: {
        year: null,
        airDate: new Date(),
        i18n: TagIntlProvider,
      },
    });

    expect(container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag': 'var(--color-background-air-date-tag)',
      '--color-text-stem-tag': 'var(--color-text-air-date-tag)',
    });
  });
});
