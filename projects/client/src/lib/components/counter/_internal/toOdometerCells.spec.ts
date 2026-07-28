import { describe, expect, it } from 'vitest';
import { toOdometerCells } from './toOdometerCells.ts';

describe('util: toOdometerCells', () => {
  const places = (cells: ReturnType<typeof toOdometerCells>) =>
    cells.flatMap((cell) => cell.kind === 'digit' ? [cell.place] : []);

  const separators = (cells: ReturnType<typeof toOdometerCells>) =>
    cells.flatMap((cell) => cell.kind === 'separator' ? [cell.text] : []);

  describe('for en', () => {
    it('should assign descending places from the most significant digit', () => {
      expect(places(toOdometerCells({ value: 17_002_054, locale: 'en' })))
        .toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
    });

    it('should emit the locale group separator between groups', () => {
      expect(separators(toOdometerCells({ value: 17_002_054, locale: 'en' })))
        .toEqual([',', ',']);
    });

    it('should not pad a small value with leading digits', () => {
      expect(places(toOdometerCells({ value: 7, locale: 'en' }))).toEqual([0]);
    });
  });

  describe('for de', () => {
    it('should use the locale separator rather than a comma', () => {
      expect(separators(toOdometerCells({ value: 17_002_054, locale: 'de' })))
        .toEqual(['.', '.']);
    });
  });

  describe('for a fractional value', () => {
    it('should lay out columns from the floored integer', () => {
      expect(places(toOdometerCells({ value: 999.94, locale: 'en' })))
        .toEqual([2, 1, 0]);
    });
  });
});
