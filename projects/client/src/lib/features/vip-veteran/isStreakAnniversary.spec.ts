import { describe, expect, it } from 'vitest';
import { isStreakAnniversary } from './isStreakAnniversary.ts';

describe('util: isStreakAnniversary', () => {
  const since = new Date('2019-03-12T18:00:00Z');

  it('should match the same day in a later year', () => {
    expect(isStreakAnniversary(since, new Date('2026-03-12T08:00:00Z'))).to
      .equal(true);
  });

  it('should not match other days', () => {
    expect(isStreakAnniversary(since, new Date('2026-03-13T08:00:00Z'))).to
      .equal(false);
  });

  it('should not match the day the streak started', () => {
    expect(isStreakAnniversary(since, new Date('2019-03-12T20:00:00Z'))).to
      .equal(false);
  });

  it('should celebrate a leap day streak on February 28 in other years', () => {
    const leapDay = new Date('2016-02-29T10:00:00Z');

    expect(isStreakAnniversary(leapDay, new Date('2027-02-28T10:00:00Z'))).to
      .equal(true);
    expect(isStreakAnniversary(leapDay, new Date('2028-02-28T10:00:00Z'))).to
      .equal(false);
    expect(isStreakAnniversary(leapDay, new Date('2028-02-29T10:00:00Z'))).to
      .equal(true);
  });
});
