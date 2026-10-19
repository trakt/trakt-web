import { describe, expect, it } from 'vitest';
import { findNextEpisodeToWatch } from './findNextEpisodeToWatch.ts';

const episodes = [{ number: 1 }, { number: 2 }, { number: 3 }];

describe('util: findNextEpisodeToWatch', () => {
  it('should find nothing without watch history', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map(),
      }),
    ).toBeUndefined();
  });

  it('should pick the episode after the newest watched one', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map([[1, new Set([1])]]),
      }),
    ).toBe(2);
  });

  it('should ignore gaps before the newest watched episode', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map([[1, new Set([2])]]),
      }),
    ).toBe(3);
  });

  it('should find nothing when the newest watched episode ends the season', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map([[1, new Set([3])]]),
      }),
    ).toBeUndefined();
  });

  it('should pick the first episode once the previous season is finished', () => {
    expect(
      findNextEpisodeToWatch({
        season: 2,
        episodes,
        watchedBySeason: new Map([[1, new Set([1, 2, 3])]]),
        previousSeasonEpisodeCount: 3,
      }),
    ).toBe(1);
  });

  it('should find nothing while the previous season is unfinished', () => {
    expect(
      findNextEpisodeToWatch({
        season: 2,
        episodes,
        watchedBySeason: new Map([[1, new Set([1, 2])]]),
        previousSeasonEpisodeCount: 3,
      }),
    ).toBeUndefined();
  });

  it('should find nothing when a later season was watched', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map([
          [1, new Set([1])],
          [2, new Set([1])],
        ]),
      }),
    ).toBeUndefined();
  });

  it('should ignore specials', () => {
    expect(
      findNextEpisodeToWatch({
        season: 1,
        episodes,
        watchedBySeason: new Map([
          [0, new Set([5])],
          [1, new Set([1])],
        ]),
      }),
    ).toBe(2);
  });
});
