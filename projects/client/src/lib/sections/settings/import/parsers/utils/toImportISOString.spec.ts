import { describe, expect, it } from 'vitest';
import { toImportISOString } from './toImportISOString.ts';

describe('util: toImportISOString', () => {
  describe('date-only values', () => {
    it('should anchor a date-only value to noon local time', () => {
      expect(toImportISOString('2026-07-20')).toBe(
        '2026-07-20T12:00:00.000Z',
      );
    });

    it('should keep the calendar day in the local timezone', () => {
      const result = toImportISOString('2026-07-20');
      const day = new Date(result ?? '').toLocaleDateString('en-CA');
      expect(day).toBe('2026-07-20');
    });

    it('should return undefined for an impossible date', () => {
      expect(toImportISOString('2026-13-45')).toBeUndefined();
    });
  });

  describe('full datetime values', () => {
    it('should preserve a value that already carries a time component', () => {
      expect(toImportISOString('2026-07-20T20:00:00.000Z')).toBe(
        '2026-07-20T20:00:00.000Z',
      );
    });

    it('should preserve a midnight UTC datetime as given', () => {
      expect(toImportISOString('2026-07-20T00:00:00Z')).toBe(
        '2026-07-20T00:00:00.000Z',
      );
    });
  });

  describe('empty and invalid values', () => {
    it('should return undefined for an empty string', () => {
      expect(toImportISOString('')).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      expect(toImportISOString(undefined)).toBeUndefined();
    });

    it('should return undefined for an unparseable value', () => {
      expect(toImportISOString('not-a-date')).toBeUndefined();
    });
  });
});
