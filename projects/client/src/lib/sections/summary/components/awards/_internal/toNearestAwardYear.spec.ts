import { describe, expect, it } from 'vitest';
import type { AwardTimelineYear } from './models/AwardTimeline.ts';
import { toNearestAwardYear } from './toNearestAwardYear.ts';

const toYear = (year: number, x: number): AwardTimelineYear => ({
  key: `year-${year}`,
  year,
  x,
  isWon: false,
  entries: [],
});

const YEARS = [toYear(1980, 10), toYear(1983, 20), toYear(2012, 80)];

describe('util: toNearestAwardYear', () => {
  it('should snap to the closest year', () => {
    expect(toNearestAwardYear(YEARS, 14)?.year).to.equal(1980);
    expect(toNearestAwardYear(YEARS, 16)?.year).to.equal(1983);
    expect(toNearestAwardYear(YEARS, 99)?.year).to.equal(2012);
  });

  it('should return nothing without years', () => {
    expect(toNearestAwardYear([], 50)).to.equal(undefined);
  });
});
