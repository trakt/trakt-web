import type { HistoryEntry } from '$lib/sections/lists/stores/models/HistoryEntry.ts';
import { MIN_DATE } from '$lib/utils/constants.ts';
import { describe, expect, it } from 'vitest';
import { buildHistorySlots } from './buildHistorySlots.ts';
import { getSlotKey } from './getSlotKey.ts';

const now = new Date('2024-06-15T12:00:00.000Z');
const generateEntry = (key: string, watchedAt: Date) =>
  ({ key, watchedAt }) as HistoryEntry;

describe('buildHistorySlots', () => {
  it('returns empty array for empty list', () => {
    expect(buildHistorySlots({ now, list: [] })).toEqual([]);
  });

  describe('single entry', () => {
    const entry = generateEntry('e1', new Date('2024-06-10T00:00:00.000Z'));
    const slots = buildHistorySlots({ now, list: [entry] });

    it('produces two slots', () => {
      expect(slots).toHaveLength(2);
    });

    it('first slot spans from now to entry.watchedAt with no entry', () => {
      expect(slots.at(0)).toMatchObject({
        key: getSlotKey(null, entry),
        startDate: now,
        endDate: entry.watchedAt,
        entry: null,
      });
    });

    it('last slot spans from entry.watchedAt to MIN_DATE with no entry', () => {
      expect(slots.at(1)).toMatchObject({
        key: getSlotKey(entry, null),
        startDate: entry.watchedAt,
        endDate: MIN_DATE,
        entry: null,
      });
    });
  });

  describe('multiple entries', () => {
    const entry1 = generateEntry('e1', new Date('2024-06-10T00:00:00.000Z'));
    const entry2 = generateEntry('e2', new Date('2024-06-05T00:00:00.000Z'));
    const entry3 = generateEntry('e3', new Date('2024-06-01T00:00:00.000Z'));
    const slots = buildHistorySlots({ now, list: [entry1, entry2, entry3] });

    it('produces n+1 slots for n entries', () => {
      expect(slots).toHaveLength(4);
    });

    it('first and last slots have no entry', () => {
      expect(slots.at(0)?.entry).toBeNull();
      expect(slots.at(3)?.entry).toBeNull();
    });

    it('middle slots carry their corresponding entry', () => {
      expect(slots.at(1)?.entry).toBe(entry1);
      expect(slots.at(2)?.entry).toBe(entry2);
    });

    it('middle slot keys combine adjacent entries', () => {
      expect(slots.at(1)?.key).toBe(getSlotKey(entry1, entry2));
      expect(slots.at(2)?.key).toBe(getSlotKey(entry2, entry3));
    });

    it('middle slot spans between adjacent watchedAt times', () => {
      expect(slots.at(1)).toMatchObject({
        startDate: entry1.watchedAt,
        endDate: entry2.watchedAt,
      });
    });
  });

  describe('duplicate watchedAt times', () => {
    const time = new Date('2024-06-10T00:00:00.000Z');
    const entry1 = generateEntry('e1', time);
    const entry2 = generateEntry('e2', time);
    const slots = buildHistorySlots({ now, list: [entry1, entry2] });

    it('still produces n+1 slots', () => {
      expect(slots).toHaveLength(3);
    });

    it('middle slot has zero width', () => {
      expect(slots.at(1)?.startDate).toEqual(slots.at(1)?.endDate);
    });
  });
});
