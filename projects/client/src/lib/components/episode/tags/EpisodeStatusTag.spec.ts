import EpisodeStatusTag from './EpisodeStatusTag.svelte';

import {
  EpisodeFinaleType,
  EpisodePremiereType,
} from '$lib/requests/models/EpisodeType.ts';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import { EpisodeIntlProvider } from '../EpisodeIntlProvider.ts';

vi.mock('$lib/stores/useMarkAsWatched');

describe('EpisodeStatusTag', () => {
  test('it renders the season finale tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodeFinaleType.season_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the series finale tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodeFinaleType.series_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the mid season finale tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodeFinaleType.mid_season_finale,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the season premiere tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodePremiereType.season_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the mid season premiere tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodePremiereType.mid_season_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the series premiere tag', () => {
    render(
      EpisodeStatusTag,
      {
        props: {
          i18n: EpisodeIntlProvider,
          episodeType: EpisodePremiereType.series_premiere,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(),
    );
    expect(tagLabel).toBeInTheDocument();
  });
});
