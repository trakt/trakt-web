import { describe, expect, it } from 'vitest';
import { toActivityRanges } from './toActivityRanges.ts';
import { WEEK_DAY_KEY } from './toTodayDays.ts';

const now = new Date(2026, 9, 5, 14, 0);
const DAY = 24 * 60 * 60 * 1000;

describe('util: toActivityRanges', () => {
  it('should use a single range for one day', () => {
    expect(toActivityRanges({ dayKey: null, now })).toHaveLength(1);
  });

  it('should split the week into windows of at most a day', () => {
    const ranges = toActivityRanges({ dayKey: WEEK_DAY_KEY, now });

    expect(ranges).toHaveLength(7);
    ranges.forEach((range) =>
      expect(range.end.getTime() - range.start.getTime()).toBeLessThanOrEqual(
        DAY,
      )
    );
  });

  it('should start with the rolling today window', () => {
    const [today] = toActivityRanges({ dayKey: WEEK_DAY_KEY, now });

    expect(today?.isRolling).toBe(true);
  });

  it('should reach back to the start of the seventh day', () => {
    const ranges = toActivityRanges({ dayKey: WEEK_DAY_KEY, now });

    expect(ranges.at(-1)?.start).toEqual(new Date(2026, 8, 29));
  });
});
