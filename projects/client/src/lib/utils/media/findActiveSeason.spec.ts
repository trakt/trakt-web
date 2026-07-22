import type { Season } from '$lib/requests/models/Season.ts';
import { EMPTY_SEASON_INFO } from '$lib/sections/lists/stores/useUserSeason.ts';
import { describe, expect, it } from 'vitest';
import { findActiveSeason } from './findActiveSeason.ts';

describe('findActiveSeason', () => {
  const createSeason = (number: number, episodeCount: number): Season => {
    return {
      number,
      episodes: {
        count: episodeCount,
      },
    } as Season;
  };

  const createSeasons = (
    seasonData: Array<{ number: number; episodeCount: number }>,
  ): Season[] =>
    seasonData.map(({ number, episodeCount }) =>
      createSeason(number, episodeCount)
    );

  const seasons = createSeasons([
    { number: 1, episodeCount: 10 },
    { number: 2, episodeCount: 12 },
    { number: 3, episodeCount: 8 },
  ]);

  const specialsOnly = createSeasons([
    { number: 0, episodeCount: 1 },
  ]);

  it('should return season 1 if there is no watched season', () => {
    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: EMPTY_SEASON_INFO,
    });

    expect(result).toBe(1);
  });

  it('should return season 1 for a structural copy of the empty season info', () => {
    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: { ...EMPTY_SEASON_INFO },
    });

    expect(result).toBe(1);
  });

  it('should return current season when not fully watched', () => {
    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: {
        number: 2,
        episodes: { count: 8 },
      },
    });

    expect(result).toBe(2);
  });

  it('should return next season when current season is fully watched', () => {
    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: {
        number: 2,
        episodes: { count: 12 },
      },
    });

    expect(result).toBe(3);
  });

  it('should stay on last season when fully watched', () => {
    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: {
        number: 3,
        episodes: { count: 8 },
      },
    });

    expect(result).toBe(3);
  });

  it('should fallback to season 1 when lastWatchedSeason not found in seasons', () => {
    const seasons = createSeasons([
      { number: 1, episodeCount: 10 },
      { number: 2, episodeCount: 12 },
    ]);

    const result = findActiveSeason({
      seasons,
      lastWatchedSeason: {
        number: 5,
        episodes: { count: 8 },
      },
    });

    expect(result).toBe(1);
  });

  it('should fallback to first non-special season when season 1 not available', () => {
    const specialSeasons = createSeasons([
      { number: 0, episodeCount: 5 },
      { number: 2, episodeCount: 12 },
      { number: 3, episodeCount: 8 },
    ]);

    const result = findActiveSeason({
      seasons: specialSeasons,
      lastWatchedSeason: {
        number: 5,
        episodes: { count: 8 },
      },
    });

    expect(result).toBe(2);
  });

  it('should fallback to specials for a specials-only show when there is no watched season', () => {
    const result = findActiveSeason({
      seasons: specialsOnly,
      lastWatchedSeason: EMPTY_SEASON_INFO,
    });

    expect(result).toBe(0);
  });

  it('should fallback to specials for a specials-only show when lastWatchedSeason not found in seasons', () => {
    const result = findActiveSeason({
      seasons: specialsOnly,
      lastWatchedSeason: {
        number: -1,
        episodes: { count: 1 },
      },
    });

    expect(result).toBe(0);
  });

  it('should stay on the last season when seasons are out of order', () => {
    const unordered = createSeasons([
      { number: 1, episodeCount: 10 },
      { number: 2, episodeCount: 12 },
      { number: 0, episodeCount: 3 },
    ]);

    const result = findActiveSeason({
      seasons: unordered,
      lastWatchedSeason: {
        number: 2,
        episodes: { count: 12 },
      },
    });

    expect(result).toBe(2);
  });

  it('should fallback to the lowest non-special season when seasons are out of order', () => {
    const unordered = createSeasons([
      { number: 0, episodeCount: 3 },
      { number: 3, episodeCount: 8 },
      { number: 2, episodeCount: 12 },
    ]);

    const result = findActiveSeason({
      seasons: unordered,
      lastWatchedSeason: EMPTY_SEASON_INFO,
    });

    expect(result).toBe(2);
  });

  it('should handle seasons not starting from 1', () => {
    const weirdSeason = createSeasons([
      { number: 3, episodeCount: 10 },
      { number: 4, episodeCount: 12 },
      { number: 5, episodeCount: 8 },
    ]);

    const result = findActiveSeason({
      seasons: weirdSeason,
      lastWatchedSeason: {
        number: 4,
        episodes: { count: 12 },
      },
    });

    expect(result).toBe(5);
  });
});
