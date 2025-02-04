import { describe, expect, it } from 'vitest';
import { toMarkAsWatchedPayload } from './toMarkAsWatchedPayload.ts';

describe('toMarkAsWatchedPayload', () => {
  const testIds = [1, 2, 3];
  const testDate = '2023-01-01T00:00:00.000Z';

  it('should transform movie payload correctly', () => {
    const result = toMarkAsWatchedPayload('movie', {
      ids: testIds,
      watchedAtDate: testDate,
    });
    expect(result).toEqual({
      movies: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should transform show payload correctly', () => {
    const result = toMarkAsWatchedPayload('show', {
      ids: testIds,
      watchedAtDate: testDate,
    });
    expect(result).toEqual({
      shows: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should transform episode payload correctly', () => {
    const result = toMarkAsWatchedPayload('episode', {
      ids: testIds,
      watchedAtDate: testDate,
    });
    expect(result).toEqual({
      episodes: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: testDate,
      })),
    });
  });

  it('should handle payload without watchedAtDate', () => {
    const result = toMarkAsWatchedPayload('movie', { ids: testIds });
    expect(result).toEqual({
      movies: testIds.map((id) => ({
        ids: { trakt: id },
        watched_at: undefined,
      })),
    });
  });
});
