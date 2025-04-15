import EpisodeStatusTag from './EpisodeStatusTag.svelte';

import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { EpisodeIntlProvider } from '../EpisodeIntlProvider.ts';

vi.mock('$lib/stores/useMarkAsWatched');

describe('EpisodeStatusTag', () => {
  test('it renders the full season tag', () => {
    render(
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
  });

  test('it renders the season finale tag', () => {
    render(
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
  });

  test('it renders the series finale tag', () => {
    render(
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
  });

  test('it renders the mid season finale tag', () => {
    render(
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
  });

  test('it renders the season premiere tag', () => {
    render(
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
  });

  test('it renders the mid season premiere tag', () => {
    render(
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
  });

  test('it renders the series premiere tag', () => {
    render(
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
  });
});
