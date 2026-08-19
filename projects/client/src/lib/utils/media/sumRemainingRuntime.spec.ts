import { describe, expect, it } from 'vitest';
import { sumRemainingRuntime } from './sumRemainingRuntime.ts';

const episodes = [
  { number: 1, runtime: 55 },
  { number: 2, runtime: 47 },
  { number: 3, runtime: 62 },
];

describe('util: sumRemainingRuntime', () => {
  it('should return 0 without episodes', () => {
    expect(
      sumRemainingRuntime({
        episodes: [],
        airedCount: 3,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(0);
  });

  it('should sum the runtime of unwatched aired episodes', () => {
    expect(
      sumRemainingRuntime({
        episodes,
        airedCount: 3,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(164);
  });

  it('should exclude watched episodes', () => {
    expect(
      sumRemainingRuntime({
        episodes,
        airedCount: 3,
        watchedEpisodeNumbers: new Set([1, 3]),
      }),
    ).toBe(47);
  });

  it('should exclude episodes beyond the aired count', () => {
    expect(
      sumRemainingRuntime({
        episodes,
        airedCount: 2,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(102);
  });

  it('should return 0 when nothing aired yet', () => {
    expect(
      sumRemainingRuntime({
        episodes,
        airedCount: 0,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(0);
  });

  it('should return 0 when every aired episode is watched', () => {
    expect(
      sumRemainingRuntime({
        episodes,
        airedCount: 2,
        watchedEpisodeNumbers: new Set([1, 2]),
      }),
    ).toBe(0);
  });

  it('should count by episode number regardless of input order', () => {
    expect(
      sumRemainingRuntime({
        episodes: [episodes[2], episodes[0], episodes[1]],
        airedCount: 1,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(55);
  });

  it('should ignore episodes with an unknown runtime', () => {
    expect(
      sumRemainingRuntime({
        episodes: [{ number: 1, runtime: NaN }, { number: 2, runtime: 47 }],
        airedCount: 2,
        watchedEpisodeNumbers: new Set(),
      }),
    ).toBe(47);
  });
});
