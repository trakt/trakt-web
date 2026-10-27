import { describe, expect, it } from 'vitest';
import { toStoryProgress } from './toStoryProgress.ts';

const season = (number: number, count: number) => ({
  number,
  episodes: { count, aired: count },
});

const SEASONS = [
  season(0, 3),
  season(1, 10),
  season(2, 13),
  season(3, 13),
  season(4, 10),
];

describe('util: toStoryProgress', () => {
  it('should mark covered seasons, the one up next and the rest', () => {
    const { steps } = toStoryProgress({ seasons: SEASONS, covered: [1, 2] });

    expect(steps).to.deep.equal([
      { season: 1, state: 'covered' },
      { season: 2, state: 'covered' },
      { season: 3, state: 'next' },
      { season: 4, state: 'pending' },
    ]);
  });

  it('should count covered seasons and episodes without specials', () => {
    const progress = toStoryProgress({ seasons: SEASONS, covered: [1, 2] });

    expect(progress.coveredCount).toBe(2);
    expect(progress.totalCount).toBe(4);
    expect(progress.episodeCount).toBe(23);
    expect(progress.nextSeason).toBe(3);
  });

  it('should have no next season when everything is covered', () => {
    const progress = toStoryProgress({
      seasons: SEASONS,
      covered: [1, 2, 3, 4],
    });

    expect(progress.nextSeason).toBeNull();
    expect(progress.steps.every(({ state }) => state === 'covered')).toBe(true);
  });

  it('should handle a show without seasons', () => {
    expect(toStoryProgress({ seasons: [], covered: [] })).to.deep.equal({
      steps: [],
      coveredCount: 0,
      totalCount: 0,
      episodeCount: 0,
      nextSeason: null,
    });
  });
});
