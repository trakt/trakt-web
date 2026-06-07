import { describe, expect, it } from 'vitest';
import { buildWatchUntilHereMedia } from './buildWatchUntilHereMedia.ts';
import type { WatchUntilEpisode } from './calculateWatchUntilTimestamps.ts';

const SHOW_RELEASE = new Date('2024-01-01T00:00:00.000Z');

function episode(season: number, number: number): WatchUntilEpisode {
  return {
    id: season * 100 + number,
    season,
    number,
    runtime: 30,
    effectiveReleaseDate: SHOW_RELEASE,
  };
}

describe('buildWatchUntilHereMedia', () => {
  it('groups timestamps into season-keyed payload entries', () => {
    const at = (iso: string) => new Date(iso);

    const result = buildWatchUntilHereMedia({
      showId: 7,
      showReleaseDate: SHOW_RELEASE,
      timestamps: [
        {
          episode: episode(2, 1),
          watchedAt: at('2024-02-01T10:00:00.000Z'),
        },
        {
          episode: episode(2, 2),
          watchedAt: at('2024-02-01T10:30:00.000Z'),
        },
        {
          episode: episode(1, 4),
          watchedAt: at('2024-01-30T10:00:00.000Z'),
        },
      ],
    });

    expect(result).toEqual({
      id: 7,
      effectiveReleaseDate: SHOW_RELEASE,
      seasons: [
        {
          number: 1,
          episodes: [
            { number: 4, watched_at: '2024-01-30T10:00:00.000Z' },
          ],
        },
        {
          number: 2,
          episodes: [
            { number: 1, watched_at: '2024-02-01T10:00:00.000Z' },
            { number: 2, watched_at: '2024-02-01T10:30:00.000Z' },
          ],
        },
      ],
    });
  });

  it('returns an empty seasons array when no timestamps are provided', () => {
    const result = buildWatchUntilHereMedia({
      showId: 1,
      showReleaseDate: SHOW_RELEASE,
      timestamps: [],
    });

    expect(result.seasons).toEqual([]);
  });
});
