// TODO fix typings in vs code
import UpNextEpisode from '$lib/components/episode/up-next/UpNextEpisode.svelte';

import { EpisodeIntlProvider } from '$lib/components/episode/EpisodeIntlProvider.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
  EpisodeStandardType,
} from '$lib/models/EpisodeType.ts';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

describe('UpNextEpisode', () => {
  const defaultProps = {
    i18n: EpisodeIntlProvider,
    episodeNumber: 1,
    seasonNumber: 1,
    posterUrl: 'https://example.com',
    showTitle: 'The Eminem Show',
    episodeTitle: 'Curtains Up (skit)',
    completed: 0,
    total: 20,
    remaining: 20,
    runtime: 3.85,
    type: EpisodeStandardType.Standard,
    isLoading: false,
    onMarkAsWatched: () => {},
  };

  test('it renders the basic details', () => {
    render(
      UpNextEpisode,
      {
        props: defaultProps,
      },
    );

    const episodeLabel = screen.getByText('1x1 - Curtains Up (skit)');
    const showLabel = screen.getByText('The Eminem Show');
    const durationLabel = screen.getByText('20 remaining / 1h 17m');

    expect(episodeLabel).toBeInTheDocument();
    expect(showLabel).toBeInTheDocument();
    expect(durationLabel).toBeInTheDocument();
  });

  test('it calls the onclick callback', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          onMarkAsWatched: onclick,
        },
      },
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onclick).toHaveBeenCalledTimes(1);
  });

  test('it disables the mark as watched button', () => {
    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          isLoading: true,
        },
      },
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('disabled')).toBe('');
  });

  test('it renders the season finale tag', () => {
    const episodeType = { type: EpisodeFinaleType.Season };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the series finale tag', () => {
    const episodeType = { type: EpisodeFinaleType.Series };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the mid season finale tag', () => {
    const episodeType = { type: EpisodeFinaleType.MidSeason };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.finaleText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the season premiere tag', () => {
    const episodeType = { type: EpisodePremiereType.Season };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the series premier tag', () => {
    const episodeType = { type: EpisodePremiereType.Series };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the mid season premiere tag', () => {
    const episodeType = { type: EpisodePremiereType.MidSeason };

    render(
      UpNextEpisode,
      {
        props: {
          ...defaultProps,
          ...episodeType,
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });
});
