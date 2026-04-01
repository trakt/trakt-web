import { describe, expect, it } from 'vitest';
import { toHumanShortDate } from './toHumanShortDate.ts';

describe('toHumanShortDate', () => {
  it('should format a date as short date in English by default', () => {
    const date = new Date('2026-04-20T12:00:00Z');
    expect(toHumanShortDate(date)).toBe('Apr 20');
  });

  it('should format a date in the provided locale', () => {
    const date = new Date('2026-04-20T12:00:00Z');
    expect(toHumanShortDate(date, 'es')).toBe('20 abr');
  });
});
