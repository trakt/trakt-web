import { describe, expect, it } from 'vitest';
import { getActiveSlotKey } from './getActiveSlotKey.ts';
import type { SlottedEntry } from './models/SlottedEntry.ts';

const slot = (key: string, startDate: Date, endDate: Date): SlottedEntry => ({
  key,
  startDate,
  endDate,
  entry: null,
});

const isoDate = (iso: string) => new Date(iso);

const history: SlottedEntry[] = [
  slot(
    'now-e1',
    isoDate('2024-06-15T12:00:00Z'),
    isoDate('2024-06-10T00:00:00Z'),
  ),
  slot(
    'e1-e2',
    isoDate('2024-06-10T00:00:00Z'),
    isoDate('2024-06-05T00:00:00Z'),
  ),
  slot('e2', isoDate('2024-06-05T00:00:00Z'), isoDate('0000-01-01T00:00:00Z')),
];

describe('getActiveSlotKey', () => {
  describe('no previously clicked key', () => {
    it('finds the slot containing the date', () => {
      expect(
        getActiveSlotKey(
          { date: isoDate('2024-06-12T00:00:00Z'), key: null },
          history,
        ),
      ).toBe('now-e1');
    });

    it('returns null when no slot contains the date', () => {
      expect(
        getActiveSlotKey(
          { date: isoDate('2025-01-01T00:00:00Z'), key: null },
          history,
        ),
      ).toBeNull();
    });
  });

  describe('with a previously clicked key', () => {
    it('returns the clicked key when date is still within that slot', () => {
      expect(
        getActiveSlotKey(
          { date: isoDate('2024-06-07T00:00:00Z'), key: 'e1-e2' },
          history,
        ),
      ).toBe('e1-e2');
    });

    it('falls back to find when date moved outside the clicked slot', () => {
      expect(
        getActiveSlotKey(
          { date: isoDate('2024-06-12T00:00:00Z'), key: 'e1-e2' },
          history,
        ),
      ).toBe('now-e1');
    });

    it('returns null when clicked key is not in history', () => {
      expect(
        getActiveSlotKey(
          { date: isoDate('2024-06-12T00:00:00Z'), key: 'ghost' },
          history,
        ),
      ).toBeNull();
    });
  });

  describe('zero-width slots (duplicate watchedAt)', () => {
    const time = isoDate('2024-06-10T00:00:00Z');
    const dupeHistory: SlottedEntry[] = [
      slot('now-e1', isoDate('2024-06-15T12:00:00Z'), time),
      slot('e1-e2', time, time),
      slot('e2', time, isoDate('0000-01-01T00:00:00Z')),
    ];

    it('sticky key holds when date equals the zero-width slot bounds', () => {
      expect(
        getActiveSlotKey({ date: time, key: 'e1-e2' }, dupeHistory),
      ).toBe('e1-e2');
    });

    it('sticky key holds for the earlier adjacent slot at the same time', () => {
      expect(
        getActiveSlotKey({ date: time, key: 'now-e1' }, dupeHistory),
      ).toBe('now-e1');
    });
  });
});
