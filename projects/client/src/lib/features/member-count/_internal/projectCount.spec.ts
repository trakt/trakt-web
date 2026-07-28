import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { projectCount } from './projectCount.ts';

describe('util: projectCount', () => {
  const ratePerDay = 8_640; // exactly one per 10 seconds

  it('should return the anchor value when no time has elapsed', () => {
    expect(projectCount({ value: 17_002_054, elapsedMs: 0, ratePerDay }))
      .toBe(17_002_054);
  });

  it('should project forward at the measured rate', () => {
    expect(projectCount({
      value: 17_002_054,
      elapsedMs: time.seconds(50),
      ratePerDay,
    })).toBe(17_002_059);
  });

  it('should accumulate without bound, since the clock is local', () => {
    expect(projectCount({
      value: 17_002_054,
      elapsedMs: time.hours(1),
      ratePerDay,
    })).toBe(17_002_054 + 360);
  });

  it('should never project below the anchor for a negative elapsed', () => {
    expect(projectCount({ value: 17_002_054, elapsedMs: -5_000, ratePerDay }))
      .toBe(17_002_054);
  });

  it('should hold still for a zero rate', () => {
    expect(projectCount({
      value: 17_000_000,
      elapsedMs: time.minutes(10),
      ratePerDay: 0,
    })).toBe(17_000_000);
  });
});
