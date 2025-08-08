import { describe, expect, it } from 'vitest';
import { toHumanMonth } from './toHumanMonth.ts';

describe('toHumanMonth', () => {
  it('should return the month name in English by default', () => {
    const date = new Date('2023-01-15');
    expect(toHumanMonth(date)).toBe('January');
  });

  it('should return the month name for February in English', () => {
    const date = new Date('2023-02-15');
    expect(toHumanMonth(date)).toBe('February');
  });

  it('should return the month name in the provided locale', () => {
    const date = new Date('2023-03-15');
    expect(toHumanMonth(date, 'es')).toBe('marzo');
  });

  it('should handle different years correctly', () => {
    const date = new Date('2020-06-15');
    expect(toHumanMonth(date)).toBe('June');
  });

  it('should handle edge cases like the beginning of a month', () => {
    const date = new Date('2023-07-01');
    expect(toHumanMonth(date)).toBe('July');
  });

  it('should handle edge cases like the end of a month', () => {
    const date = new Date('2023-08-31');
    expect(toHumanMonth(date)).toBe('August');
  });

  it('should return the short month name in English', () => {
    const date = new Date('2023-01-15');
    expect(toHumanMonth(date, 'en', 'short')).toBe('Jan');
  });

  it('should return the short month name in other locales', () => {
    const date = new Date('2023-01-15');
    expect(toHumanMonth(date, 'es', 'short')).toBe('ene');
  });
});
