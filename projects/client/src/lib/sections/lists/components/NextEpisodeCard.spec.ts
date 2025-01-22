import NextEpisodeCard from './NextEpisodeCard.svelte';

import { EpisodeIntlProvider } from '$lib/components/episode/EpisodeIntlProvider.ts';
import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import {
  EpisodeFinaleType,
  EpisodePremiereType,
  EpisodeStandardType,
} from '$lib/requests/models/EpisodeType.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';
import type { ShowEntry } from '../../../requests/models/ShowEntry.ts';

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
      type: EpisodeStandardType.standard,
    } as unknown as EpisodeProgressEntry,
    show: {
      title: 'The Eminem Show',
    } as ShowEntry,
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
    const episodeType = { type: EpisodeFinaleType.season_finale };

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
    const episodeType = { type: EpisodeFinaleType.series_finale };

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
    const episodeType = { type: EpisodeFinaleType.mid_season_finale };

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
    const episodeType = { type: EpisodePremiereType.season_premiere };

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
    const episodeType = { type: EpisodePremiereType.series_premiere };

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
    const episodeType = { type: EpisodePremiereType.mid_season_premiere };

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
