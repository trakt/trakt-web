import { describe, expect, it } from 'vitest';
import { toHumanDuration } from './toHumanDuration.ts';

describe('toHumanDuration', () => {
  it('should return a human readable duration', () => {
    expect(toHumanDuration({ days: 1, hours: 2, minutes: 3 })).toBe('1d 2h 3m');
  });

  it('should display 300m as 5h', () => {
    expect(toHumanDuration({ minutes: 300 })).toBe('5h');
  });

  it('should display 1440m as 1d', () => {
    expect(toHumanDuration({ minutes: 1440 })).toBe('1d');
  });

  it('should display 1441m as 1d 1m', () => {
    expect(toHumanDuration({ minutes: 1441 })).toBe('1d 1m');
  });

  it('should display 1500m as 1d 1h', () => {
    expect(toHumanDuration({ minutes: 1500 })).toBe('1d 1h');
  });

  it('should display 1501m as 1d 1h 1m', () => {
    expect(toHumanDuration({ minutes: 1501 })).toBe('1d 1h 1m');
  });

  it('should display 1530m as 1d 1h 30m', () => {
    expect(toHumanDuration({ minutes: 1530 })).toBe('1d 1h 30m');
  });

  it('should return empty string when all parts are 0', () => {
    expect(toHumanDuration({})).toBe('');
  });
});
