import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';
import { describe, expect, it } from 'vitest';
import { getPlaysSummary } from './getPlaysSummary.ts';

function toEntry(id: number, plays: Array<[number, string]>): MediaPlays {
  return {
    id,
    plays: plays.map(([playId, watchedAt]) => ({
      id: playId,
      watchedAt: new Date(watchedAt),
    })),
  };
}

describe('util: getPlaysSummary', () => {
  it('should return an empty summary for no entries', () => {
    expect(getPlaysSummary([])).toEqual({
      unique: 0,
      total: 0,
      duplicates: 0,
      duplicateIds: [],
    });
  });

  it('should not flag single plays as duplicates', () => {
    const summary = getPlaysSummary([
      toEntry(1, [[100, '2024-01-01T10:00:00.000Z']]),
      toEntry(2, [[200, '2024-02-01T10:00:00.000Z']]),
    ]);

    expect(summary).toEqual({
      unique: 2,
      total: 2,
      duplicates: 0,
      duplicateIds: [],
    });
  });

  it('should keep only the most recent play of each entry', () => {
    const summary = getPlaysSummary([
      toEntry(1, [
        [100, '2024-01-01T10:00:00.000Z'],
        [101, '2024-03-01T10:00:00.000Z'],
        [102, '2024-02-01T10:00:00.000Z'],
      ]),
      toEntry(2, [
        [200, '2024-05-01T10:00:00.000Z'],
        [201, '2024-04-01T10:00:00.000Z'],
      ]),
    ]);

    expect(summary.unique).toBe(2);
    expect(summary.total).toBe(5);
    expect(summary.duplicates).toBe(3);
    expect(summary.duplicateIds).toEqual([102, 100, 201]);
  });

  it('should not depend on the order of incoming plays', () => {
    const ascending = getPlaysSummary([
      toEntry(1, [
        [100, '2024-01-01T10:00:00.000Z'],
        [101, '2024-02-01T10:00:00.000Z'],
      ]),
    ]);
    const descending = getPlaysSummary([
      toEntry(1, [
        [101, '2024-02-01T10:00:00.000Z'],
        [100, '2024-01-01T10:00:00.000Z'],
      ]),
    ]);

    expect(ascending.duplicateIds).toEqual([100]);
    expect(descending.duplicateIds).toEqual([100]);
  });
});
