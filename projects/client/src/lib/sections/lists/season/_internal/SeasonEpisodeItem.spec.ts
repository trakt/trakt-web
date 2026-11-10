import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SeasonEpisodeItem from './SeasonEpisodeItem.svelte';

const baseProps = {
  show: ShowSiloMappedMock,
  episode: EpisodeSiloMappedMock,
  previousSeasons: [],
  hasUnseenEpisodes: false,
  currentSeasonEpisodes: [EpisodeSiloMappedMock],
  watchedBySeason: new Map<number, ReadonlySet<number>>(),
  isWatchedLoading: false,
  source: 'test',
};

describe('component: SeasonEpisodeItem', () => {
  it('should mark the current episode with aria-current', async () => {
    renderComponent(SeasonEpisodeItem, {
      props: { ...baseProps, isCurrentEpisode: true },
    });

    const title = await screen.findByText('Freedom Day');
    expect(title.closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('should not set aria-current when it is not the current episode', async () => {
    renderComponent(SeasonEpisodeItem, { props: baseProps });

    const title = await screen.findByText('Freedom Day');
    expect(title.closest('[aria-current]')).toBeNull();
  });
});
