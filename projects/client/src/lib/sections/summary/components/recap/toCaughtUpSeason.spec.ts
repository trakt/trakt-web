import { describe, expect, it } from 'vitest';
import { toCaughtUpSeason } from './toCaughtUpSeason.ts';

const season = (number: number, aired: number) => ({
  number,
  episodes: { count: aired, aired },
});

const SEASONS = [season(0, 2), season(1, 6), season(2, 6), season(3, 6)];

describe('util: toCaughtUpSeason', () => {
  it('should be 0 when nothing is watched', () => {
    expect(
      toCaughtUpSeason({ seasons: SEASONS, watchedPerSeason: new Map() }),
    ).toBe(0);
  });

  it('should be 0 while the first season is in progress', () => {
    expect(
      toCaughtUpSeason({
        seasons: SEASONS,
        watchedPerSeason: new Map([[1, 3]]),
      }),
    ).toBe(0);
  });

  it('should stop at the last finished season', () => {
    expect(
      toCaughtUpSeason({
        seasons: SEASONS,
        watchedPerSeason: new Map([
          [1, 6],
          [2, 4],
        ]),
      }),
    ).toBe(1);
  });

  it('should use the highest finished season when an earlier one has gaps', () => {
    expect(
      toCaughtUpSeason({
        seasons: SEASONS,
        watchedPerSeason: new Map([
          [2, 6],
          [3, 2],
        ]),
      }),
    ).toBe(2);
  });

  it('should ignore specials', () => {
    expect(
      toCaughtUpSeason({
        seasons: SEASONS,
        watchedPerSeason: new Map([[0, 2]]),
      }),
    ).toBe(0);
  });

  it('should ignore seasons with no aired episodes', () => {
    expect(
      toCaughtUpSeason({
        seasons: [...SEASONS, season(4, 0)],
        watchedPerSeason: new Map([
          [1, 6],
          [2, 6],
          [3, 6],
        ]),
      }),
    ).toBe(3);
  });
});
