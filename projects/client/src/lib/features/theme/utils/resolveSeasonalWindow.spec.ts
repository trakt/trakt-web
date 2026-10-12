import { describe, expect, it } from 'vitest';
import { resolveSeasonalWindow } from './resolveSeasonalWindow.ts';

describe('util: resolveSeasonalWindow', () => {
  describe('within a single year', () => {
    const seasonalWindow = {
      start: { month: 10, day: 30 },
      end: { month: 11, day: 2 },
    };

    it('should pin the window to the current year', () => {
      const result = resolveSeasonalWindow({
        ...seasonalWindow,
        now: new Date(2031, 2, 1),
      });

      expect(result).toEqual({
        start: { month: 10, day: 30, year: 2031 },
        end: { month: 11, day: 2, year: 2031 },
      });
    });
  });

  describe('across the turn of the year', () => {
    const seasonalWindow = {
      start: { month: 12, day: 31 },
      end: { month: 1, day: 2 },
    };

    it('should point to the upcoming window when out of season', () => {
      const result = resolveSeasonalWindow({
        ...seasonalWindow,
        now: new Date(2026, 5, 15),
      });

      expect(result).toEqual({
        start: { month: 12, day: 31, year: 2026 },
        end: { month: 1, day: 2, year: 2027 },
      });
    });

    it('should end in the next year when it starts this year', () => {
      const result = resolveSeasonalWindow({
        ...seasonalWindow,
        now: new Date(2026, 11, 31),
      });

      expect(result).toEqual({
        start: { month: 12, day: 31, year: 2026 },
        end: { month: 1, day: 2, year: 2027 },
      });
    });

    it('should start in the previous year when it is already running', () => {
      const result = resolveSeasonalWindow({
        ...seasonalWindow,
        now: new Date(2027, 0, 1),
      });

      expect(result).toEqual({
        start: { month: 12, day: 31, year: 2026 },
        end: { month: 1, day: 2, year: 2027 },
      });
    });
  });
});
