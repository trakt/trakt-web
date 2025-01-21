import NextEpisodeCard from './NextEpisodeCard.svelte';

import { EpisodeIntlProvider } from '$lib/components/episode/EpisodeIntlProvider.ts';
import type { EpisodeProgressEntry } from '$lib/models/EpisodeProgressEntry.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
  EpisodeStandardType,
} from '$lib/models/EpisodeType.ts';
import type { ShowSummary } from '$lib/requests/models/ShowSummary.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';

import { writable } from 'svelte/store';
import { useMarkAsWatched } from '../../media-actions/mark-as-watched/useMarkAsWatched.ts';

vi.mock('$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts');

describe('NextEpisodeCard', () => {
  const defaultProps = {
    episode: {
      number: 1,
      season: 1,
      cover: {
        url: 'https://example.com',
      },
      title: 'Curtains Up (skit)',
      completed: 0,
      total: 20,
      remaining: 20,
      minutesLeft: 77,
      type: EpisodeStandardType.Standard,
    } as EpisodeProgressEntry,
    show: {
      title: 'The Eminem Show',
    } as ShowSummary,
  };

  const markAsWatchedSpy = vi.fn();

  beforeEach(() => {
    const isMarkingAsWatched = writable(false);
    markAsWatchedSpy.mockImplementationOnce(
      () => isMarkingAsWatched.set(true),
    );

    (useMarkAsWatched as Mock).mockReturnValue({
      isMarkingAsWatched,
      markAsWatched: markAsWatchedSpy,
    });
  });

  test('it renders the basic details', () => {
    render(
      NextEpisodeCard,
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
    render(
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
        },
      },
    );

    const button = screen.getByRole('button');
    await fireEvent.click(button);

    expect(markAsWatchedSpy).toHaveBeenCalledTimes(1);
  });

  test('it disables the mark as watched button', async () => {
    render(
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
        },
      },
    );

    const button = screen.getByRole('button');
    await waitFor(() => expect(button.hasAttribute('disabled')));
  });

  test('it renders the season finale tag', () => {
    const episodeType = { type: EpisodeFinaleType.Season };

    render(
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
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
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
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
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
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
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });

  test('it renders the series premiere tag', () => {
    const episodeType = { type: EpisodePremiereType.Series };

    render(
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
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
      NextEpisodeCard,
      {
        props: {
          ...defaultProps,
          episode: {
            ...defaultProps.episode,
            ...episodeType,
          },
        },
      },
    );

    const tagLabel = screen.getByText(
      EpisodeIntlProvider.premiereText(episodeType),
    );
    expect(tagLabel).toBeInTheDocument();
  });
});
