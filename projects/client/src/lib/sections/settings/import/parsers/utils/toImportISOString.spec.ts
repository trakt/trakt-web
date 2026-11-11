import { describe, expect, it } from 'vitest';
import { toImportISOString } from './toImportISOString.ts';

describe('util: toImportISOString', () => {
  describe('date-only values', () => {
    it('should anchor a date-only value to noon UTC', () => {
      expect(toImportISOString('2026-07-20')).toBe('2026-07-20T12:00:00.000Z');
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

  describe('values without a zone designator', () => {
    it('should read a space separated datetime as UTC', () => {
      expect(toImportISOString('2024-01-01 20:00:00')).toBe(
        '2024-01-01T20:00:00.000Z',
      );
    });

    it('should read a T separated datetime as UTC', () => {
      expect(toImportISOString('2024-01-01T20:00:00')).toBe(
        '2024-01-01T20:00:00.000Z',
      );
    });

    it('should read fractional seconds as UTC', () => {
      expect(toImportISOString('2024-01-01 20:00:00.250')).toBe(
        '2024-01-01T20:00:00.250Z',
      );
    });

    it('should not depend on the runtime timezone', () => {
      const previous = process.env.TZ;
      process.env.TZ = 'America/Los_Angeles';
      try {
        expect(toImportISOString('2024-01-01 20:00:00')).toBe(
          '2024-01-01T20:00:00.000Z',
        );
        expect(toImportISOString('2024-01-01')).toBe(
          '2024-01-01T12:00:00.000Z',
        );
      } finally {
        process.env.TZ = previous;
      }
    });
  });

  describe('values with an explicit offset', () => {
    it('should honor the offset', () => {
      expect(toImportISOString('2024-01-01T20:00:00+02:00')).toBe(
        '2024-01-01T18:00:00.000Z',
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
