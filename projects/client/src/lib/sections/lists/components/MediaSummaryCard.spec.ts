import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MediaSummaryCard from './MediaSummaryCard.svelte';

const [season] = ShowSiloSeasonsMappedMock;

describe('component: MediaSummaryCard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show the movie title and genres', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'movie',
        media: MovieHereticMappedMock,
      },
    });

    expect(await screen.findByText('Heretic')).toBeInTheDocument();
    expect(screen.getByText(/Horror/i)).toBeInTheDocument();
  });

  it('should show the original title when it differs from the title', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'movie',
        media: { ...MovieHereticMappedMock, originalTitle: 'Hereje' },
      },
    });

    expect(await screen.findByText('(Hereje)')).toBeInTheDocument();
  });

  it('should not repeat the original title when it matches', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'movie',
        media: { ...MovieHereticMappedMock, originalTitle: 'HERETIC' },
      },
    });

    await screen.findByText('Heretic');
    expect(screen.queryByText('(HERETIC)')).toBeNull();
  });

  it('should show the role for the credit variant', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'movie',
        variant: 'credit',
        role: 'Mr. Reed',
        media: MovieHereticMappedMock,
      },
    });

    expect(await screen.findByText('Mr. Reed')).toBeInTheDocument();
    expect(screen.queryByText(/Horror/i)).toBeNull();
  });

  it('should show the show title and season label for seasons', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'season',
        season,
        media: ShowSiloMappedMock,
      },
    });

    expect(await screen.findByText('Silo')).toBeInTheDocument();
    expect(screen.getByText('Season 1')).toBeInTheDocument();
  });

  it('should show the unknown date label for activity without a date', async () => {
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'episode',
        variant: 'activity',
        activityType: 'personal',
        date: new Date(0),
        episode: EpisodeSiloMappedMock,
        media: ShowSiloMappedMock,
      },
    });

    expect(await screen.findByText(/Freedom Day/)).toBeInTheDocument();
    expect(screen.getByText('S1 • E1')).toBeInTheDocument();
    expect(screen.getByText('Unknown date')).toBeInTheDocument();
  });

  it('should show a date for social activity', async () => {
    const now = new Date('2026-01-01T12:00:00.000Z');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(now);
    renderComponent(MediaSummaryCard, {
      props: {
        type: 'movie',
        variant: 'activity',
        activityType: 'social',
        date: new Date(now.getTime() - 1000 * 60 * 5),
        media: MovieHereticMappedMock,
      },
    });

    expect(await screen.findByText('Heretic')).toBeInTheDocument();
    expect(screen.getByText('today')).toBeInTheDocument();
  });
});
