import type { EpisodeProgressEntry } from '$lib/requests/models/EpisodeProgressEntry.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import EpisodeItem from './EpisodeItem.svelte';

const nextEpisode: EpisodeProgressEntry = {
  ...EpisodeSiloMappedMock,
  type: 'standard',
  total: 10,
  completed: 4,
  remaining: 6,
  minutesLeft: 360,
  isLatestAired: false,
};

const baseProps = {
  episode: EpisodeSiloMappedMock,
  media: ShowSiloMappedMock,
};

describe('component: EpisodeItem', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show the show title, episode label and duration for the default variant', async () => {
    renderComponent(EpisodeItem, {
      props: { ...baseProps, variant: 'default' },
    });

    expect(await screen.findByText('Silo')).toBeInTheDocument();
    expect(screen.getByText('S1 • E1')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('should lead with the episode title in the show context', async () => {
    renderComponent(EpisodeItem, {
      props: { ...baseProps, variant: 'default', context: 'show' },
    });

    expect(await screen.findByText('Freedom Day')).toBeInTheDocument();
    expect(screen.queryByText('Silo')).toBeNull();
  });

  it('should show the remaining count instead of a status tag for the next variant', async () => {
    renderComponent(EpisodeItem, {
      props: { ...baseProps, episode: nextEpisode, variant: 'next' },
    });

    expect(await screen.findByText('Silo')).toBeInTheDocument();
    expect(screen.getByText('6 left')).toBeInTheDocument();
    expect(screen.queryByText('Premiere')).toBeNull();
  });

  it('should show a release tag for the upcoming variant', async () => {
    const now = new Date('2026-01-01T12:00:00.000Z');
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(now);
    renderComponent(EpisodeItem, {
      props: {
        ...baseProps,
        episode: {
          ...EpisodeSiloMappedMock,
          effectiveReleaseDate: new Date(now.getTime() + 1000 * 60 * 60 * 72),
        },
        variant: 'upcoming',
      },
    });

    expect(await screen.findByText('Silo')).toBeInTheDocument();
    expect(screen.getByText('in 3 days')).toBeInTheDocument();
  });

  it('should show the activity date for the activity variant', async () => {
    renderComponent(EpisodeItem, {
      props: {
        ...baseProps,
        variant: 'activity',
        activityType: 'personal',
        date: new Date(Date.now() - 1000 * 60 * 5),
      },
    });

    expect(await screen.findByText('Silo')).toBeInTheDocument();
    expect(screen.getByText('today')).toBeInTheDocument();
  });

  it('should show the season and episode tag for the list item variant', async () => {
    renderComponent(EpisodeItem, {
      props: { ...baseProps, variant: 'list-item' },
    });

    expect(await screen.findByText('S1 • E1')).toBeInTheDocument();
    expect(screen.queryByText('1h')).toBeNull();
  });
});
