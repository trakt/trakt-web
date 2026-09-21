import { describe, expect, it } from 'vitest';
import { countSkippedEpisodes } from './countSkippedEpisodes.ts';

const NOW = new Date('2026-01-01T00:00:00.000Z');
const AIRED = new Date('2025-01-01T00:00:00.000Z');
const UNAIRED = new Date('2027-01-01T00:00:00.000Z');

const episode = (number: number, effectiveReleaseDate = AIRED) => ({
  number,
  effectiveReleaseDate,
});

const count = (
  props: Partial<Parameters<typeof countSkippedEpisodes>[0]> = {},
) =>
  countSkippedEpisodes({
    target: { season: 2, number: 10 },
    currentSeasonEpisodes: [],
    previousSeasons: [],
    watchedBySeason: new Map(),
    now: NOW,
    ...props,
  });

describe('util: countSkippedEpisodes', () => {
  it('should count nothing when there is no gap behind the target', () => {
    expect(
      count({
        currentSeasonEpisodes: [episode(9), episode(10)],
        watchedBySeason: new Map([[2, new Set([9])]]),
      }),
    ).toBe(0);
  });

  it('should count the unwatched episodes before the target', () => {
    expect(
      count({
        currentSeasonEpisodes: [7, 8, 9, 10].map((n) => episode(n)),
        watchedBySeason: new Map([[2, new Set<number>()]]),
      }),
    ).toBe(3);
  });

  it('should ignore episodes after the target', () => {
    expect(
      count({
        currentSeasonEpisodes: [9, 10, 11, 12].map((n) => episode(n)),
        watchedBySeason: new Map(),
      }),
    ).toBe(1);
  });

  it('should ignore episodes that have not aired', () => {
    expect(
      count({
        currentSeasonEpisodes: [episode(8, UNAIRED), episode(9)],
        watchedBySeason: new Map(),
      }),
    ).toBe(1);
  });

  it('should count gaps left in earlier seasons', () => {
    expect(
      count({
        previousSeasons: [{ number: 1, episodes: { aired: 8 } }],
        watchedBySeason: new Map([[1, new Set([1, 2, 3])]]),
      }),
    ).toBe(5);
  });

  it('should not count a season the target does not follow', () => {
    expect(
      count({
        target: { season: 1, number: 5 },
        previousSeasons: [{ number: 2, episodes: { aired: 8 } }],
        watchedBySeason: new Map(),
      }),
    ).toBe(0);
  });

  it('should never report a negative gap for an over-watched season', () => {
    expect(
      count({
        previousSeasons: [{ number: 1, episodes: { aired: 2 } }],
        watchedBySeason: new Map([[1, new Set([1, 2, 3, 4])]]),
      }),
    ).toBe(0);
  });
});
