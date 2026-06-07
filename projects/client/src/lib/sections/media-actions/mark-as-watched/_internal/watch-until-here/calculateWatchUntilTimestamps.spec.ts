import { describe, expect, it } from 'vitest';
import {
  calculateWatchUntilTimestamps,
  type WatchUntilEpisode,
} from './calculateWatchUntilTimestamps.ts';

const RELEASE_DATE = new Date('2024-01-01T00:00:00.000Z');

function episode(
  partial: Partial<WatchUntilEpisode> & {
    id: number;
    season: number;
    number: number;
  },
): WatchUntilEpisode {
  return {
    runtime: 45,
    effectiveReleaseDate: new Date(
      RELEASE_DATE.getTime() + partial.number * 7 * 86_400_000,
    ),
    ...partial,
  };
}

describe('calculateWatchUntilTimestamps', () => {
  const episodes = [
    episode({ id: 1, season: 2, number: 3, runtime: 30 }),
    episode({ id: 2, season: 2, number: 4, runtime: 60 }),
    episode({ id: 3, season: 2, number: 5, runtime: 45 }),
  ];

  it('returns an empty array when there are no episodes', () => {
    const result = calculateWatchUntilTimestamps({
      episodes: [],
      mode: 'just-now',
    });

    expect(result).toEqual([]);
  });

  it('anchors just-now mode to the last episode and decrements by next runtime', () => {
    const now = new Date('2024-06-01T20:00:00.000Z');

    const result = calculateWatchUntilTimestamps({
      episodes,
      mode: 'just-now',
      now,
    });

    expect(result.map((entry) => entry.watchedAt.toISOString())).toEqual([
      new Date(now.getTime() - 60 * 60_000 - 45 * 60_000).toISOString(),
      new Date(now.getTime() - 45 * 60_000).toISOString(),
      now.toISOString(),
    ]);
  });

  it('mirrors just-now behavior when custom-end is used with an explicit anchor', () => {
    const anchor = new Date('2024-06-01T20:00:00.000Z');

    const result = calculateWatchUntilTimestamps({
      episodes,
      mode: 'custom-end',
      anchor,
    });

    expect(result[2]!.watchedAt).toEqual(anchor);
    expect(result[1]!.watchedAt).toEqual(
      new Date(anchor.getTime() - 45 * 60_000),
    );
    expect(result[0]!.watchedAt).toEqual(
      new Date(anchor.getTime() - 45 * 60_000 - 60 * 60_000),
    );
  });

  it('walks forward from the anchor when in custom-start mode', () => {
    const anchor = new Date('2024-06-01T10:00:00.000Z');

    const result = calculateWatchUntilTimestamps({
      episodes,
      mode: 'custom-start',
      anchor,
    });

    expect(result[0]!.watchedAt).toEqual(
      new Date(anchor.getTime() + 30 * 60_000),
    );
    expect(result[1]!.watchedAt).toEqual(
      new Date(anchor.getTime() + 30 * 60_000 + 60 * 60_000),
    );
    expect(result[2]!.watchedAt).toEqual(
      new Date(anchor.getTime() + 30 * 60_000 + 60 * 60_000 + 45 * 60_000),
    );
  });

  it('uses each episode release date when in released mode', () => {
    const result = calculateWatchUntilTimestamps({
      episodes,
      mode: 'released',
    });

    expect(result.map((entry) => entry.watchedAt)).toEqual(
      episodes.map((entry) => entry.effectiveReleaseDate),
    );
  });

  it('falls back to fallbackRuntime when an episode runtime is missing', () => {
    const broken = [
      episode({ id: 10, season: 1, number: 1, runtime: NaN }),
      episode({ id: 11, season: 1, number: 2, runtime: NaN }),
    ];
    const now = new Date('2024-06-01T00:00:00.000Z');

    const result = calculateWatchUntilTimestamps({
      episodes: broken,
      mode: 'just-now',
      now,
      fallbackRuntime: 30,
    });

    expect(result[1]!.watchedAt).toEqual(now);
    expect(result[0]!.watchedAt).toEqual(new Date(now.getTime() - 30 * 60_000));
  });

  it('throws when anchor is missing for custom-start and custom-end modes', () => {
    expect(() =>
      calculateWatchUntilTimestamps({ episodes, mode: 'custom-start' })
    ).toThrowError(/anchor/);
    expect(() =>
      calculateWatchUntilTimestamps({ episodes, mode: 'custom-end' })
    ).toThrowError(/anchor/);
  });
});
