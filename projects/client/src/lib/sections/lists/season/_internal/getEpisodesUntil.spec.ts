import { describe, expect, it } from 'vitest';
import { getEpisodesUntil } from './getEpisodesUntil.ts';

describe('getEpisodesUntil', () => {
  it('should return current season episodes when no previous seasons exist', () => {
    const episode = {
      season: 1,
      number: 3,
    };

    const result = getEpisodesUntil({
      previousSeasons: [],
      episode,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [
          { number: 1 },
          { number: 2 },
          { number: 3 },
        ],
      },
    ]);
  });

  it('should include episodes from previous seasons', () => {
    const previousSeasons = [
      { number: 1, episodes: { count: 2 } },
    ];

    const episode = {
      season: 2,
      number: 3,
    };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [
          { number: 1 },
          { number: 2 },
        ],
      },
      {
        number: 2,
        episodes: [
          { number: 1 },
          { number: 2 },
          { number: 3 },
        ],
      },
    ]);
  });

  it('should handle multiple previous seasons', () => {
    const previousSeasons = [
      { number: 1, episodes: { count: 3 } },
      { number: 2, episodes: { count: 2 } },
    ];

    const episode = {
      season: 3,
      number: 1,
    };

    const result = getEpisodesUntil({
      previousSeasons,
      episode,
    });

    expect(result).toEqual([
      {
        number: 1,
        episodes: [
          { number: 1 },
          { number: 2 },
          { number: 3 },
        ],
      },
      {
        number: 2,
        episodes: [
          { number: 1 },
          { number: 2 },
        ],
      },
      {
        number: 3,
        episodes: [
          { number: 1 },
        ],
      },
    ]);
  });
});
