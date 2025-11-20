import { describe, expect, it } from 'vitest';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';

describe('toMarkAsWatchedPayload', () => {
  const testIds = [1, 2, 3];
  const testDate = '2023-01-01T00:00:00.000Z';

  const testMedia = testIds.map((id) => ({ id }));

  it('should transform movie payload correctly', () => {
    const result = toMarkAsWatchedPayload(
      {
        type: 'movie' as const,
        media: testMedia,
      },
      testDate,
    );

    expect(result).toEqual({
      movies: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should transform show payload correctly', () => {
    const result = toMarkAsWatchedPayload(
      {
        type: 'show' as const,
        media: testMedia,
      },
      testDate,
    );

    expect(result).toEqual({
      shows: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should transform episode payload correctly', () => {
    const episodes = testMedia.map((media, index) => ({
      id: media.id,
      season: 1,
      number: index + 1,
    }));

    const result = toMarkAsWatchedPayload(
      {
        type: 'episode' as const,
        show: { id: 1, title: 'show' },
        media: episodes,
      },
      testDate,
    );

    expect(result).toEqual({
      episodes: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should transform partial shows payload correctly', () => {
    const partialShows = testMedia.map((media, index) => ({
      id: media.id,
      seasons: [
        {
          number: 1,
          episodes: [{ number: index + 1 }],
        },
      ],
    }));

    const result = toMarkAsWatchedPayload(
      {
        type: 'show' as const,
        media: partialShows,
      },
      testDate,
    );

    expect(result).toEqual({
      shows: testIds.map((id, index) => ({
        ids: { trakt: id },
        watched_at: undefined,
        seasons: [{
          number: 1,
          episodes: [{ number: index + 1, watched_at: testDate }],
        }],
      })),
    });
  });
});
