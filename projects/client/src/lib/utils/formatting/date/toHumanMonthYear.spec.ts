import { describe, expect, it } from 'vitest';
import { toHumanMonthYear } from './toHumanMonthYear.ts';

describe('toHumanMonthYear', () => {
  it('should format the month and year in English by default', () => {
    expect(toHumanMonthYear(new Date('2019-03-01T10:00:00Z'))).toBe(
      'March 2019',
    );
  });

  it('should read the date in UTC', () => {
    expect(toHumanMonthYear(new Date('2019-03-01T00:30:00Z'))).toBe(
      'March 2019',
    );
  });

  it('should format in the provided locale', () => {
    expect(toHumanMonthYear(new Date('2019-03-01T10:00:00Z'), 'es')).toBe(
      'marzo de 2019',
    );
  });
});
