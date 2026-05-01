import { describe, expect, it } from 'vitest';
import { toHumanLongDate } from './toHumanLongDate.ts';

describe('toHumanLongDate', () => {
  it('should format a date as long date in English by default', () => {
    const date = new Date('2026-04-20T12:00:00Z');
    expect(toHumanLongDate(date)).toBe('April 20, 2026');
  });

  it('should format a date in the provided locale', () => {
    const date = new Date('2026-04-20T12:00:00Z');
    expect(toHumanLongDate(date, 'es')).toBe('20 de abril de 2026');
  });
});
