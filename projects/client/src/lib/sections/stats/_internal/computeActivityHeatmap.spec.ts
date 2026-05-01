import { describe, expect, it } from 'vitest';
import { computeActivityHeatmap } from './computeActivityHeatmap.ts';

const LOCALE = 'en';

// Wednesday, January 15, 2025
const NOW = new Date(2025, 0, 15);

describe('computeActivityHeatmap', () => {
  describe('toIntensity', () => {
    it('returns intensity 0 for 0 watches', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE);
      expect(cells.every((c) => c.intensity === 0)).toBe(true);
    });

    it('returns intensity 1 for 1 watch', () => {
      const { cells } = computeActivityHeatmap(
        [new Date(2025, 0, 1)],
        NOW,
        LOCALE,
      );
      const cell = cells.find((c) => c.date.getDate() === 1);
      expect(cell?.intensity).toBe(1);
    });

    it('returns intensity 2 for 2-3 watches', () => {
      const dates = [new Date(2025, 0, 2), new Date(2025, 0, 2)];
      const { cells } = computeActivityHeatmap(dates, NOW, LOCALE);
      const cell = cells.find((c) => c.date.getDate() === 2);
      expect(cell?.intensity).toBe(2);
    });

    it('returns intensity 3 for 4-6 watches', () => {
      const dates = Array.from({ length: 5 }, () => new Date(2025, 0, 3));
      const { cells } = computeActivityHeatmap(dates, NOW, LOCALE);
      const cell = cells.find((c) => c.date.getDate() === 3);
      expect(cell?.intensity).toBe(3);
    });

    it('returns intensity 4 for 7+ watches', () => {
      const dates = Array.from({ length: 7 }, () => new Date(2025, 0, 5));
      const { cells } = computeActivityHeatmap(dates, NOW, LOCALE);
      const cell = cells.find((c) => c.date.getDate() === 5);
      expect(cell?.intensity).toBe(4);
    });
  });

  describe('month period (default)', () => {
    it('returns one cell per day in the month', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE);
      expect(cells).toHaveLength(31); // January has 31 days
    });

    it('marks future dates with isFuture=true and count=0', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE);
      const futureCells = cells.filter((c) => c.date > NOW);
      expect(futureCells.every((c) => c.isFuture)).toBe(true);
      expect(futureCells.every((c) => c.count === 0)).toBe(true);
    });

    it('does not count watches on future dates', () => {
      const futureDate = new Date(2025, 0, 20); // after NOW (Jan 15)
      const { cells } = computeActivityHeatmap([futureDate], NOW, LOCALE);
      const cell = cells.find((c) => c.date.getDate() === 20);
      expect(cell?.count).toBe(0);
      expect(cell?.intensity).toBe(0);
    });

    it('marks today with isToday=true', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE);
      const todayCells = cells.filter((c) => c.isToday);
      expect(todayCells).toHaveLength(1);
      expect(todayCells.at(0)?.date.getDate()).toBe(15);
    });

    it('accumulates multiple watches on the same day', () => {
      const dates = [
        new Date(2025, 0, 10),
        new Date(2025, 0, 10),
        new Date(2025, 0, 10),
      ];
      const { cells } = computeActivityHeatmap(dates, NOW, LOCALE);
      const cell = cells.find((c) => c.date.getDate() === 10);
      expect(cell?.count).toBe(3);
    });

    it('returns a localized monthLabel', () => {
      const { monthLabel } = computeActivityHeatmap([], NOW, LOCALE);
      expect(monthLabel).toContain('January');
      expect(monthLabel).toContain('2025');
    });

    it('returns 7 dayLabels', () => {
      const { dayLabels } = computeActivityHeatmap([], NOW, LOCALE);
      expect(dayLabels).toHaveLength(7);
    });

    it('assigns col values in range 0-6', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE);
      expect(cells.every((c) => c.col >= 0 && c.col <= 6)).toBe(true);
    });

    it('assigns row values consistently with totalRows', () => {
      const { cells, totalRows } = computeActivityHeatmap([], NOW, LOCALE);
      const maxRow = Math.max(...cells.map((c) => c.row));
      expect(totalRows).toBe(maxRow + 1);
    });
  });

  describe('week period', () => {
    it('returns exactly 7 cells', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE, 'week');
      expect(cells).toHaveLength(7);
    });

    it('returns an empty monthLabel', () => {
      const { monthLabel } = computeActivityHeatmap([], NOW, LOCALE, 'week');
      expect(monthLabel).toBe('');
    });

    it('marks today with isToday=true', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE, 'week');
      const todayCells = cells.filter((c) => c.isToday);
      expect(todayCells).toHaveLength(1);
    });

    it('marks future days with isFuture=true', () => {
      const { cells } = computeActivityHeatmap([], NOW, LOCALE, 'week');
      const futureCells = cells.filter((c) => c.isFuture);
      expect(futureCells.every((c) => c.count === 0)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty watchedDates without errors', () => {
      expect(() => computeActivityHeatmap([], NOW, LOCALE)).not.toThrow();
    });

    it('ignores watches from a different month', () => {
      const otherMonth = new Date(2024, 11, 25); // December
      const { cells } = computeActivityHeatmap([otherMonth], NOW, LOCALE);
      expect(cells.every((c) => c.count === 0)).toBe(true);
    });
  });
});
