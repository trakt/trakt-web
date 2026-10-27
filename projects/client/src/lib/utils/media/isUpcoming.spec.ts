import { time } from '$lib/utils/timing/time.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isUpcoming } from './isUpcoming.ts';

const NOW = new Date('2024-01-15T12:00:00Z');

describe('util: isUpcoming', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be upcoming when the release date is in the future', () => {
    expect(
      isUpcoming({
        effectiveReleaseDate: new Date(NOW.getTime() + time.hours(1)),
      }),
    ).toBe(true);
  });

  it('should not be upcoming when the release date has passed', () => {
    expect(
      isUpcoming({
        effectiveReleaseDate: new Date(NOW.getTime() - time.hours(1)),
      }),
    ).toBe(false);
  });

  it('should not be upcoming at the exact release time', () => {
    expect(isUpcoming({ effectiveReleaseDate: NOW })).toBe(false);
  });

  it('should be upcoming within the aired buffer of hasAired', () => {
    expect(
      isUpcoming({
        effectiveReleaseDate: new Date(NOW.getTime() + time.hours(23)),
      }),
    ).toBe(true);
  });
});
