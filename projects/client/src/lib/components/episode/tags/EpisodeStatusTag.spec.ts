import EpisodeStatusTag from './EpisodeStatusTag.svelte';

import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { EpisodeIntlProvider } from '../EpisodeIntlProvider';

vi.mock('$lib/stores/useMarkAsWatched');

describe('EpisodeStatusTag', () => {
  test('it renders the full season tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodeComputedType.full_season,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.fullSeasonText(),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag': 'var(--color-background-full-season-tag)',
      '--color-text-stem-tag': 'var(--color-text-full-season-tag)',
    });
  });

  test('it renders the season finale tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodeFinaleType.season_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText({ type: EpisodeFinaleType.season_finale }),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag': 'var(--color-background-finale-tag)',
      '--color-text-stem-tag': 'var(--color-text-finale-tag)',
    });
  });

  test('it renders the series finale tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodeFinaleType.series_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText({ type: EpisodeFinaleType.series_finale }),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag': 'var(--color-background-finale-tag)',
      '--color-text-stem-tag': 'var(--color-text-finale-tag)',
    });
  });

  test('it renders the mid season finale tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodeFinaleType.mid_season_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText({
        type: EpisodeFinaleType.mid_season_finale,
      }),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag': 'var(--color-background-finale-tag)',
      '--color-text-stem-tag': 'var(--color-text-finale-tag)',
    });
  });

  test('it renders the season premiere tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodePremiereType.season_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText({
        type: EpisodePremiereType.season_premiere,
      }),
    );
    expect(tagLabel).toBeInTheDocument();

    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag':
        'var(--color-background-season-premiere-tag)',
      '--color-text-stem-tag': 'var(--color-text-season-premiere-tag)',
    });
  });

  test('it renders the mid season premiere tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodePremiereType.mid_season_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText({
        type: EpisodePremiereType.mid_season_premiere,
      }),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag':
        'var(--color-background-season-premiere-tag)',
      '--color-text-stem-tag': 'var(--color-text-season-premiere-tag)',
    });
  });

  test('it renders the series premiere tag', () => {
    const component = render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          type: EpisodePremiereType.series_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText({
        type: EpisodePremiereType.series_premiere,
      }),
    );
    expect(tagLabel).toBeInTheDocument();
    expect(component.container.firstElementChild).toHaveStyle({
      '--color-background-stem-tag':
        'var(--color-background-series-premiere-tag)',
      '--color-text-stem-tag': 'var(--color-text-series-premiere-tag)',
    });
  });
});
