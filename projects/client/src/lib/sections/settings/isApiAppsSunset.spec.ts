import { describe, expect, it } from 'vitest';
import { isApiAppsSunset } from './isApiAppsSunset.ts';

describe('isApiAppsSunset', () => {
  it('is not sunset a day before the cutoff', () => {
    expect(isApiAppsSunset(new Date('2026-10-21T23:59:59Z'))).toBe(false);
  });

  it('is sunset exactly on the cutoff', () => {
    expect(isApiAppsSunset(new Date('2026-10-22T00:00:00Z'))).toBe(true);
  });

  it('is sunset after the cutoff', () => {
    expect(isApiAppsSunset(new Date('2026-11-01T00:00:00Z'))).toBe(true);
  });
});
