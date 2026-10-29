import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import type { ComponentProps } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import EpisodeInfoHeader from './EpisodeInfoHeader.svelte';

const baseProps: ComponentProps<typeof EpisodeInfoHeader> = {
  show: ShowSiloMappedMock,
  seasons: ShowSiloSeasonsMappedMock,
  season: 1,
  episode: 3,
  entry: EpisodeSiloMappedMock,
  crew: { directors: [], writers: [], creators: [], cast: [], guestStars: [] },
  isCrewLoading: false,
  socialTarget: { type: 'show', slug: 'silo' },
  socialTitle: 'Silo',
  onRatingsOpen: vi.fn(),
  onSocialOpen: vi.fn(),
  onHistoryOpen: vi.fn(),
};

describe('component: EpisodeInfoHeader', () => {
  it('should show the season and episode number', async () => {
    renderComponent(EpisodeInfoHeader, { props: baseProps });

    expect(await screen.findByText('Season 1 • Episode 3')).toBeInTheDocument();
  });

  it('should show the air date, runtime and genre as subtitle', async () => {
    renderComponent(EpisodeInfoHeader, { props: baseProps });

    expect(
      await screen.findByText('May 5th, 2023 at 1:00 AM • 1h • TV-MA • Drama'),
    ).toBeInTheDocument();
  });

  it('should not offer a previous link on the very first episode', async () => {
    renderComponent(EpisodeInfoHeader, {
      props: { ...baseProps, episode: 1 },
    });

    await screen.findByText('Season 1 • Episode 1');
    expect(screen.queryByRole('link', { name: 'Previous episode' })).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Next episode' }),
    ).toBeInTheDocument();
  });

  it('should not offer a next link on the last episode of the last season', async () => {
    const lastSeason = ShowSiloSeasonsMappedMock.at(-1);
    renderComponent(EpisodeInfoHeader, {
      props: {
        ...baseProps,
        seasons: ShowSiloSeasonsMappedMock,
        season: lastSeason?.number ?? 1,
        episode: lastSeason?.episodes.count ?? 1,
      },
    });

    await screen.findByRole('link', { name: 'Previous episode' });
    expect(screen.queryByRole('link', { name: 'Next episode' })).toBeNull();
  });

  it('should render without an entry while loading', async () => {
    renderComponent(EpisodeInfoHeader, {
      props: { ...baseProps, entry: undefined },
    });

    expect(await screen.findByText('Season 1 • Episode 3')).toBeInTheDocument();
    expect(screen.queryByText(/Sheriff Becker's plans/)).toBeNull();
    expect(screen.queryByText(/TV-MA/)).toBeNull();
  });
});
