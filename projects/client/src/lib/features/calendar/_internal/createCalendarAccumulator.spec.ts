import { describe, expect, it } from 'vitest';
import type { Calendar } from '../models/Calendar.ts';
import { createCalendarAccumulator } from './createCalendarAccumulator.ts';

type TestItem = { key: string };

function mockCalendar(
  startDate: string,
  days: number,
): Calendar<TestItem> {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return { date, items: [] };
  });
}

describe('createCalendarAccumulator', () => {
  describe('accumulate', () => {
    it('should return a single period for one calendar', () => {
      const { accumulate } = createCalendarAccumulator('chronological');
      const calendar = mockCalendar('2024-01-01', 7);

      const result = accumulate({ calendar, fingerprint: 'a' });

      expect(result).toHaveLength(1);
      expect(result[0]?.calendar).toBe(calendar);
    });

    it('should accumulate multiple periods', () => {
      const { accumulate } = createCalendarAccumulator('chronological');
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      const result = accumulate({ calendar: week2, fingerprint: 'a' });

      expect(result).toHaveLength(2);
      expect(result[0]?.calendar).toBe(week1);
      expect(result[1]?.calendar).toBe(week2);
    });

    it('should replace a period with the same start date', () => {
      const { accumulate } = createCalendarAccumulator('chronological');
      const week1 = mockCalendar('2024-01-01', 7);
      const week1Updated = mockCalendar('2024-01-01', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      const result = accumulate({
        calendar: week1Updated,
        fingerprint: 'a',
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.calendar).toBe(week1Updated);
    });

    it('should sort periods chronologically', () => {
      const { accumulate } = createCalendarAccumulator('chronological');
      const week2 = mockCalendar('2024-01-08', 7);
      const week1 = mockCalendar('2024-01-01', 7);

      accumulate({ calendar: week2, fingerprint: 'a' });
      const result = accumulate({ calendar: week1, fingerprint: 'a' });

      expect(result[0]?.calendar).toBe(week1);
      expect(result[1]?.calendar).toBe(week2);
    });

    it('should sort periods in reverse-chronological order', () => {
      const { accumulate } = createCalendarAccumulator(
        'reverse-chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      const result = accumulate({ calendar: week2, fingerprint: 'a' });

      expect(result[0]?.calendar).toBe(week2);
      expect(result[1]?.calendar).toBe(week1);
    });

    it('should clear accumulated data on fingerprint change', () => {
      const { accumulate } = createCalendarAccumulator('chronological');
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      const result = accumulate({ calendar: week2, fingerprint: 'b' });

      expect(result).toHaveLength(1);
      expect(result[0]?.calendar).toBe(week2);
    });

    it('should return empty periods for an empty calendar', () => {
      const { accumulate } = createCalendarAccumulator('chronological');

      const result = accumulate({ calendar: [], fingerprint: 'a' });

      expect(result).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should remove accumulated periods', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      clear();
      const result = accumulate({ calendar: week1, fingerprint: 'a' });

      expect(result).toHaveLength(1);
    });

    it('should reset fingerprint tracking', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      accumulate({ calendar: week2, fingerprint: 'a' });
      clear();

      const result = accumulate({ calendar: week1, fingerprint: 'a' });

      expect(result).toHaveLength(1);
    });
  });

  describe('clearedToKey', () => {
    it('should reject data that does not match the target date', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      accumulate({ calendar: week2, fingerprint: 'a' });

      clear(new Date('2024-01-08'));

      const result = accumulate({ calendar: week1, fingerprint: 'a' });

      expect(result).toHaveLength(0);
    });

    it('should accept data matching the target date', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);

      clear(new Date('2024-01-01'));

      const result = accumulate({ calendar: week1, fingerprint: 'a' });

      expect(result).toHaveLength(1);
      expect(result[0]?.calendar).toBe(week1);
    });

    it('should resume normal accumulation after matching key arrives', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);

      clear(new Date('2024-01-01'));

      accumulate({ calendar: week1, fingerprint: 'a' });
      const result = accumulate({ calendar: week2, fingerprint: 'a' });

      expect(result).toHaveLength(2);
    });

    it('should preserve stale data while rejecting mismatched keys', () => {
      const { accumulate, clear } = createCalendarAccumulator(
        'chronological',
      );
      const week1 = mockCalendar('2024-01-01', 7);
      const week2 = mockCalendar('2024-01-08', 7);
      const week3 = mockCalendar('2024-01-15', 7);

      accumulate({ calendar: week1, fingerprint: 'a' });
      accumulate({ calendar: week2, fingerprint: 'a' });

      clear(new Date('2024-01-15'));

      const staleResult = accumulate({
        calendar: week1,
        fingerprint: 'a',
      });

      expect(staleResult).toHaveLength(0);

      const result = accumulate({ calendar: week3, fingerprint: 'a' });

      expect(result).toHaveLength(1);
      expect(result[0]?.calendar).toBe(week3);
    });
  });

  describe('canLoadMore', () => {
    it('should return true initially', () => {
      const { canLoadMore } = createCalendarAccumulator('chronological');
      expect(canLoadMore()).toBe(true);
    });

    it('should return false after 5 consecutive empty periods', () => {
      const { accumulate, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 5; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }

      expect(canLoadMore()).toBe(false);
    });

    it('should return true if there is a non-empty period before 5 empty ones', () => {
      const { accumulate, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 4; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }

      const nonEmptyPeriod = mockCalendar('2024-01-05', 1);
      if (nonEmptyPeriod[0]) {
        nonEmptyPeriod[0].items.push({ key: 'item' });
      }
      accumulate({ calendar: nonEmptyPeriod, fingerprint: 'a' });

      for (let i = 0; i < 4; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 6}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }

      expect(canLoadMore()).toBe(true);
    });

    it('should reset consecutive empty periods counter upon clearing', () => {
      const { accumulate, clear, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 5; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }
      expect(canLoadMore()).toBe(false);

      clear();
      expect(canLoadMore()).toBe(true);
    });

    it('should reset consecutive empty periods counter upon fingerprint change', () => {
      const { accumulate, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 5; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }
      expect(canLoadMore()).toBe(false);

      const newEmptyPeriod = mockCalendar('2024-02-01', 1);
      accumulate({ calendar: newEmptyPeriod, fingerprint: 'b' });
      expect(canLoadMore()).toBe(true);
    });

    it('should reset empty periods count when an empty period is updated with data', () => {
      const { accumulate, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 5; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }

      expect(canLoadMore()).toBe(false);

      const updatedPeriod = mockCalendar('2024-01-05', 1);
      if (updatedPeriod[0]) {
        updatedPeriod[0].items.push({ key: 'item' });
      }

      accumulate({ calendar: updatedPeriod, fingerprint: 'a' });
      expect(canLoadMore()).toBe(true);
    });

    it('should not reset empty periods count when an empty period is updated but remains empty', () => {
      const { accumulate, canLoadMore } = createCalendarAccumulator(
        'chronological',
      );

      for (let i = 0; i < 5; i++) {
        const emptyPeriod = mockCalendar(`2024-01-0${i + 1}`, 1);
        accumulate({ calendar: emptyPeriod, fingerprint: 'a' });
      }

      expect(canLoadMore()).toBe(false);

      const updatedEmptyPeriod = mockCalendar('2024-01-05', 1);
      accumulate({ calendar: updatedEmptyPeriod, fingerprint: 'a' });
      expect(canLoadMore()).toBe(false);
    });
  });
});
