import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';
import { describe, expect, it } from 'vitest';
import { getPlaysSummary } from './getPlaysSummary.ts';
import type { PlayRetention } from './PlayRetention.ts';

function toEntry(id: number, plays: Array<[number, string]>): MediaPlays {
  return {
    id,
    plays: plays.map(([playId, watchedAt]) => ({
      id: playId,
      watchedAt: new Date(watchedAt),
    })),
  };
}

const REWATCHED_ENTRIES = [
  toEntry(1, [
    [100, '2024-01-01T10:00:00.000Z'],
    [101, '2024-03-01T10:00:00.000Z'],
    [102, '2024-02-01T10:00:00.000Z'],
  ]),
  toEntry(2, [
    [200, '2024-05-01T10:00:00.000Z'],
    [201, '2024-04-01T10:00:00.000Z'],
  ]),
];

const SHUFFLED_ENTRIES = [
  toEntry(1, [
    [102, '2024-02-01T10:00:00.000Z'],
    [100, '2023-06-01T10:00:00.000Z'],
    [103, '2024-08-01T10:00:00.000Z'],
    [101, '2023-12-01T10:00:00.000Z'],
  ]),
];

const TIED_ENTRIES = [
  toEntry(1, [
    [100, '2024-01-01T10:00:00.000Z'],
    [101, '2024-01-01T10:00:00.000Z'],
  ]),
];

const ASCENDING_ENTRIES = [
  toEntry(1, [
    [100, '2024-01-01T10:00:00.000Z'],
    [101, '2024-02-01T10:00:00.000Z'],
  ]),
];

const DESCENDING_ENTRIES = [
  toEntry(1, [
    [101, '2024-02-01T10:00:00.000Z'],
    [100, '2024-01-01T10:00:00.000Z'],
  ]),
];

describe('util: getPlaysSummary', () => {
  it('should return an empty summary for no entries', () => {
    expect(getPlaysSummary({ entries: [], keep: 'oldest' })).toEqual({
      unique: 0,
      total: 0,
      duplicates: 0,
      duplicateIds: [],
    });
  });

  it('should not flag single plays as duplicates', () => {
    const summary = getPlaysSummary({
      entries: [
        toEntry(1, [[100, '2024-01-01T10:00:00.000Z']]),
        toEntry(2, [[200, '2024-02-01T10:00:00.000Z']]),
      ],
      keep: 'oldest',
    });

    expect(summary).toEqual({
      unique: 2,
      total: 2,
      duplicates: 0,
      duplicateIds: [],
    });
  });

  it.each<[PlayRetention, number[]]>([
    ['oldest', [102, 101, 200]],
    ['newest', [100, 102, 201]],
  ])(
    'should keep only the %s play of each entry',
    (keep, duplicateIds) => {
      const summary = getPlaysSummary({ entries: REWATCHED_ENTRIES, keep });

      expect(summary.unique).toBe(2);
      expect(summary.total).toBe(5);
      expect(summary.duplicates).toBe(3);
      expect(summary.duplicateIds).toEqual(duplicateIds);
    },
  );

  it.each<[PlayRetention, number, number[]]>([
    ['oldest', 100, [101, 102, 103]],
    ['newest', 103, [100, 101, 102]],
  ])(
    'should never flag the %s play as a duplicate',
    (keep, keptId, duplicateIds) => {
      const summary = getPlaysSummary({ entries: SHUFFLED_ENTRIES, keep });

      expect(summary.duplicateIds).not.toContain(keptId);
      expect(summary.duplicateIds).toEqual(duplicateIds);
    },
  );

  it.each<[PlayRetention, number]>([
    ['oldest', 101],
    ['newest', 100],
  ])(
    'should not depend on the order of incoming plays when keeping the %s',
    (keep, duplicateId) => {
      const ascending = getPlaysSummary({ entries: ASCENDING_ENTRIES, keep });
      const descending = getPlaysSummary({ entries: DESCENDING_ENTRIES, keep });

      expect(ascending.duplicateIds).toEqual([duplicateId]);
      expect(descending.duplicateIds).toEqual([duplicateId]);
    },
  );

  it.each<[PlayRetention, number]>([
    ['oldest', 101],
    ['newest', 100],
  ])(
    'should fall back to input order when keeping the %s of identical timestamps',
    (keep, duplicateId) => {
      const summary = getPlaysSummary({ entries: TIED_ENTRIES, keep });

      expect(summary.duplicates).toBe(1);
      expect(summary.duplicateIds).toEqual([duplicateId]);
    },
  );

  it('should collect duplicates across entries with mixed play counts', () => {
    const summary = getPlaysSummary({
      entries: [
        toEntry(1, [[100, '2024-01-01T10:00:00.000Z']]),
        toEntry(2, [
          [201, '2024-04-01T10:00:00.000Z'],
          [200, '2024-02-01T10:00:00.000Z'],
        ]),
        toEntry(3, [
          [300, '2024-01-15T10:00:00.000Z'],
          [301, '2024-01-16T10:00:00.000Z'],
          [302, '2024-01-17T10:00:00.000Z'],
        ]),
      ],
      keep: 'oldest',
    });

    expect(summary).toEqual({
      unique: 3,
      total: 6,
      duplicates: 3,
      duplicateIds: [201, 301, 302],
    });
  });

  it('should report identical counts regardless of which play is kept', () => {
    const oldest = getPlaysSummary({
      entries: REWATCHED_ENTRIES,
      keep: 'oldest',
    });
    const newest = getPlaysSummary({
      entries: REWATCHED_ENTRIES,
      keep: 'newest',
    });

    expect(oldest.unique).toBe(newest.unique);
    expect(oldest.total).toBe(newest.total);
    expect(oldest.duplicates).toBe(newest.duplicates);
    expect(oldest.duplicateIds).not.toEqual(newest.duplicateIds);
  });
});
