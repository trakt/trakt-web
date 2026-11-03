import { describe, expect, it } from 'vitest';
import { yirWeekRange } from './yirWeekRange.ts';

const toDay = (date: Date) => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
];

describe('util: yirWeekRange', () => {
  describe('year starting on a thursday (2026)', () => {
    it('should end the first week on the first sunday', () => {
      const { start, end } = yirWeekRange(2026, 0);

      expect(toDay(start)).toEqual([2026, 1, 1]);
      expect(toDay(end)).toEqual([2026, 1, 4]);
    });

    it('should run later weeks from monday to sunday', () => {
      const { start, end } = yirWeekRange(2026, 44);

      expect(toDay(start)).toEqual([2026, 11, 2]);
      expect(toDay(end)).toEqual([2026, 11, 8]);
    });

    it('should end the last week on december 31st', () => {
      const { start, end } = yirWeekRange(2026, 52);

      expect(toDay(start)).toEqual([2026, 12, 28]);
      expect(toDay(end)).toEqual([2026, 12, 31]);
    });
  });

  describe('year starting on a monday (2024)', () => {
    it('should start the first full week on january 1st', () => {
      const { start, end } = yirWeekRange(2024, 0);

      expect(toDay(start)).toEqual([2024, 1, 1]);
      expect(toDay(end)).toEqual([2024, 1, 7]);
    });
  });

  describe('year starting on a friday (2027)', () => {
    it('should end the first week on the first sunday', () => {
      const { start, end } = yirWeekRange(2027, 0);

      expect(toDay(start)).toEqual([2027, 1, 1]);
      expect(toDay(end)).toEqual([2027, 1, 3]);
    });

    it('should start the second week on the first monday', () => {
      expect(toDay(yirWeekRange(2027, 1).start)).toEqual([2027, 1, 4]);
    });
  });
});
