import { describe, expect, it } from 'vitest';
import { getEpisodesUntil } from './getEpisodesUntil.ts';

const noWatched = new Map<number, Set<number>>();

describe('getEpisodesUntil', () => {
  it('should return current season episodes when no previous seasons exist', () => {
    const episode = { season: 1, number: 3 };

    const result = getEpisodesUntil({
      previousSeasons: [],
      episode,
      watchedBySeason: noWatched,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [{ number: 1 }, { number: 2 }, { number: 3 }],
      },
    ]);
  });

  it('should include episodes from previous seasons', () => {
    const previousSeasons = [{ number: 1, episodes: { count: 2 } }];
    const episode = { season: 2, number: 3 };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
      watchedBySeason: noWatched,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [{ number: 1 }, { number: 2 }],
      },
      {
        number: 2,
        episodes: [{ number: 1 }, { number: 2 }, { number: 3 }],
      },
    ]);
  });

  it('should handle multiple previous seasons', () => {
    const previousSeasons = [
      { number: 1, episodes: { count: 3 } },
      { number: 2, episodes: { count: 2 } },
    ];
    const episode = { season: 3, number: 1 };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
      watchedBySeason: noWatched,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [{ number: 1 }, { number: 2 }, { number: 3 }],
      },
      {
        number: 2,
        episodes: [{ number: 1 }, { number: 2 }],
      },
      {
        number: 3,
        episodes: [{ number: 1 }],
      },
    ]);
  });

  it('should exclude watched episodes from previous seasons', () => {
    const previousSeasons = [{ number: 1, episodes: { count: 3 } }];
    const episode = { season: 2, number: 2 };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
      watchedBySeason: new Map([[1, new Set([1, 3])]]),
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [{ number: 2 }],
      },
      {
        number: 2,
        episodes: [{ number: 1 }, { number: 2 }],
      },
    ]);
  });

  it('should skip fully-watched previous seasons', () => {
    const previousSeasons = [{ number: 1, episodes: { count: 2 } }];
    const episode = { season: 2, number: 1 };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
      watchedBySeason: new Map([[1, new Set([1, 2])]]),
    });

    expect(result).toEqual([
      {
        number: 2,
        episodes: [{ number: 1 }],
      },
    ]);
  });

  it('should exclude watched episodes from current season', () => {
    const episode = { season: 1, number: 3 };

    const result = getEpisodesUntil({
      previousSeasons: [],
      episode,
      watchedBySeason: new Map([[1, new Set([2])]]),
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [{ number: 1 }, { number: 3 }],
      },
    ]);
  });
});
