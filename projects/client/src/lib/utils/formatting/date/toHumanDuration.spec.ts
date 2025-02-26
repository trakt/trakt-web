import { describe, expect, it } from 'vitest';
import { toHumanDuration } from './toHumanDuration.ts';

describe('toHumanDuration', () => {
  it('should return a human readable duration', () => {
    expect(toHumanDuration({ hours: 2, minutes: 3 })).toBe('2h 3m');
  });

  it('should display 300m as 5h', () => {
    expect(toHumanDuration({ minutes: 300 })).toBe('5h');
  });

  it('should display 100m as 1h 40m', () => {
    expect(toHumanDuration({ minutes: 100 })).toBe('1h 40m');
  });

  it('should display 101m as 1h 41m', () => {
    expect(toHumanDuration({ minutes: 101 })).toBe('1h 41m');
  });

  it('should display 130m as 2h 10m', () => {
    expect(toHumanDuration({ minutes: 130 })).toBe('2h 10m');
  });

  it('should display 1440m as 1d', () => {
    expect(toHumanDuration({ minutes: 1440 })).toBe('1d');
  });

  it('should display 1441m as 1d', () => {
    expect(toHumanDuration({ minutes: 1441 })).toBe('1d');
  });

  it('should return empty string when all parts are 0', () => {
    expect(toHumanDuration({})).toBe('');
  });

  it('should use a custom separator', () => {
    expect(toHumanDuration({ minutes: 72, separator: ', ' })).toBe(
      '1h, 12m',
    );
  });

  it('should use a custom unit display units', () => {
    expect(toHumanDuration({ minutes: 90, unitDisplay: 'long' })).toBe(
      '1 hour 30 minutes',
    );
  });
});
