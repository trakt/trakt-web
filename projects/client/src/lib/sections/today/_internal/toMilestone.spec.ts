import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toMilestone } from './toMilestone.ts';

const episode = {
  ...EpisodeSiloMappedMock,
  season: 2,
  number: 4,
  type: 'standard' as const,
  episodes: null,
};

describe('util: toMilestone', () => {
  it('should have no milestone for a regular episode', () => {
    expect(toMilestone(episode)).toBeNull();
  });

  it('should have no milestone for a movie', () => {
    expect(toMilestone(null)).toBeNull();
  });

  it('should mark the first episode as starting the show', () => {
    expect(toMilestone({ ...episode, season: 1, number: 1 })).toEqual({
      type: 'series-start',
      season: 1,
    });
  });

  it('should mark a season premiere as starting that season', () => {
    expect(toMilestone({ ...episode, number: 1, type: 'season_premiere' }))
      .toEqual({ type: 'season-start', season: 2 });
  });

  it('should mark finales as finishing the season or the show', () => {
    expect(toMilestone({ ...episode, type: 'season_finale' }))
      .toEqual({ type: 'season-end', season: 2 });
    expect(toMilestone({ ...episode, type: 'series_finale' }))
      .toEqual({ type: 'series-end', season: 2 });
  });

  it('should pick the biggest milestone from a binge', () => {
    const binge = {
      ...episode,
      type: 'multiple_episodes' as const,
      episodes: [
        { ...episode, type: 'season_finale' as const },
        { ...episode, season: 3, number: 1, type: 'series_finale' as const },
      ],
    };

    expect(toMilestone(binge)).toEqual({ type: 'series-end', season: 3 });
  });
});
