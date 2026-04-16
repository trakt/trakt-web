import { describe, expect, it } from 'vitest';
import { computeMonthlyStats } from './computeMonthlyStats.ts';

const NOW = new Date(2026, 3, 16); // April 16, 2026

function getDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

describe('computeMonthlyStats', () => {
  describe('empty input', () => {
    it('returns zeros for all stats except totalElapsedDaysThisMonth', () => {
      const result = computeMonthlyStats([], NOW);

      expect(result).toEqual({
        currentStreak: 0,
        previousStreak: 0,
        droppedStreaksThisMonth: 0,
        activeDaysThisMonth: 0,
        totalElapsedDaysThisMonth: 16,
        activeDaysThisYear: 0,
      });
    });
  });

  describe('totalElapsedDaysThisMonth', () => {
    it('returns the current day of the month', () => {
      const { totalElapsedDaysThisMonth } = computeMonthlyStats([], NOW);
      expect(totalElapsedDaysThisMonth).toBe(16);
    });
  });

  describe('currentStreak', () => {
    it('counts a single day with activity today', () => {
      const { currentStreak } = computeMonthlyStats(
        [getDate(2026, 4, 16)],
        NOW,
      );
      expect(currentStreak).toBe(1);
    });

    it('counts consecutive days ending today', () => {
      const dates = [
        getDate(2026, 4, 14),
        getDate(2026, 4, 15),
        getDate(2026, 4, 16),
      ];
      const { currentStreak } = computeMonthlyStats(dates, NOW);
      expect(currentStreak).toBe(3);
    });

    it('counts consecutive days ending yesterday', () => {
      const dates = [
        getDate(2026, 4, 13),
        getDate(2026, 4, 14),
        getDate(2026, 4, 15),
      ];
      const { currentStreak } = computeMonthlyStats(dates, NOW);
      expect(currentStreak).toBe(3);
    });

    it('returns 0 when the last activity was before yesterday', () => {
      const { currentStreak } = computeMonthlyStats(
        [getDate(2026, 4, 10)],
        NOW,
      );
      expect(currentStreak).toBe(0);
    });
  });

  describe('previousStreak', () => {
    it('returns 0 when there is no segment before the active one', () => {
      const dates = [getDate(2026, 4, 15), getDate(2026, 4, 16)];
      const { previousStreak } = computeMonthlyStats(dates, NOW);
      expect(previousStreak).toBe(0);
    });

    it('returns the length of the segment immediately before the current streak', () => {
      const dates = [
        getDate(2026, 4, 5),
        getDate(2026, 4, 6),
        getDate(2026, 4, 7),
        getDate(2026, 4, 15),
        getDate(2026, 4, 16),
      ];
      const { previousStreak } = computeMonthlyStats(dates, NOW);
      expect(previousStreak).toBe(3);
    });

    it('returns the segment before a streak ending yesterday', () => {
      const dates = [
        getDate(2026, 4, 5),
        getDate(2026, 4, 6),
        getDate(2026, 4, 14),
        getDate(2026, 4, 15),
      ];
      const { previousStreak } = computeMonthlyStats(dates, NOW);
      expect(previousStreak).toBe(2);
    });
  });

  describe('droppedStreaksThisMonth', () => {
    it('returns 0 when there are no broken streaks this month', () => {
      const dates = [getDate(2026, 4, 15), getDate(2026, 4, 16)];
      const { droppedStreaksThisMonth } = computeMonthlyStats(dates, NOW);
      expect(droppedStreaksThisMonth).toBe(0);
    });

    it('counts one dropped streak ending this month before today', () => {
      const dates = [
        getDate(2026, 4, 5),
        getDate(2026, 4, 6),
        getDate(2026, 4, 7),
        getDate(2026, 4, 15),
        getDate(2026, 4, 16),
      ];
      const { droppedStreaksThisMonth } = computeMonthlyStats(dates, NOW);
      expect(droppedStreaksThisMonth).toBe(1);
    });

    it('counts multiple dropped streaks ending this month', () => {
      const dates = [
        getDate(2026, 4, 1),
        getDate(2026, 4, 5),
        getDate(2026, 4, 10),
        getDate(2026, 4, 16),
      ];
      const { droppedStreaksThisMonth } = computeMonthlyStats(dates, NOW);
      expect(droppedStreaksThisMonth).toBe(3);
    });

    it('does not count streaks that ended in a previous month', () => {
      const dates = [
        getDate(2026, 3, 10),
        getDate(2026, 3, 11),
        getDate(2026, 4, 16),
      ];
      const { droppedStreaksThisMonth } = computeMonthlyStats(dates, NOW);
      expect(droppedStreaksThisMonth).toBe(0);
    });
  });

  describe('activeDaysThisMonth', () => {
    it('counts only days in the current month', () => {
      const dates = [
        getDate(2026, 3, 10),
        getDate(2026, 4, 1),
        getDate(2026, 4, 16),
      ];
      const { activeDaysThisMonth } = computeMonthlyStats(dates, NOW);
      expect(activeDaysThisMonth).toBe(2);
    });

    it('deduplicates multiple watches on the same day', () => {
      const dates = [
        getDate(2026, 4, 16),
        getDate(2026, 4, 16),
        getDate(2026, 4, 16),
      ];
      const { activeDaysThisMonth } = computeMonthlyStats(dates, NOW);
      expect(activeDaysThisMonth).toBe(1);
    });
  });

  describe('activeDaysThisYear', () => {
    it('counts only days in the current year', () => {
      const dates = [
        getDate(2025, 12, 28),
        getDate(2025, 12, 29),
        getDate(2026, 3, 10),
        getDate(2026, 4, 16),
      ];
      const { activeDaysThisYear } = computeMonthlyStats(dates, NOW);
      expect(activeDaysThisYear).toBe(2);
    });

    it('includes all months in the current year', () => {
      const dates = [
        getDate(2026, 1, 5),
        getDate(2026, 2, 14),
        getDate(2026, 3, 10),
        getDate(2026, 4, 16),
      ];
      const { activeDaysThisYear } = computeMonthlyStats(dates, NOW);
      expect(activeDaysThisYear).toBe(4);
    });
  });
});
