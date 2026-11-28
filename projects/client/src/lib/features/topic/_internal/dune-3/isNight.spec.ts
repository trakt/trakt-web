import { describe, expect, it } from 'vitest';
import { isNight } from './isNight.ts';

const at = (hour: number, minute = 0) => new Date(2026, 11, 18, hour, minute);

describe('util: isNight', () => {
  it('should be night from 19:00', () => {
    expect(isNight(at(19))).toBe(true);
    expect(isNight(at(23, 59))).toBe(true);
  });

  it('should be day just before 19:00', () => {
    expect(isNight(at(18, 59))).toBe(false);
  });

  it('should be night after midnight until 05:59', () => {
    expect(isNight(at(0))).toBe(true);
    expect(isNight(at(5, 59))).toBe(true);
  });

  it('should be day from 06:00', () => {
    expect(isNight(at(6))).toBe(false);
    expect(isNight(at(12))).toBe(false);
  });
});
