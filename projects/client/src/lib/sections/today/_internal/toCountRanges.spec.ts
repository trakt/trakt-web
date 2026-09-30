import { describe, expect, it } from 'vitest';
import { toCountRanges } from './toCountRanges.ts';
import { WEEK_DAY_KEY } from './toTodayDays.ts';

const now = new Date(2026, 9, 5, 14, 0);

describe('util: toCountRanges', () => {
  it('should cover the week without overlapping windows', () => {
    const ranges = toCountRanges({ dayKey: WEEK_DAY_KEY, now });
    const sorted = ranges.toSorted((a, b) =>
      a.start.getTime() - b.start.getTime()
    );

    expect(sorted.at(0)?.start).toEqual(new Date(2026, 8, 29));
    expect(sorted.at(-1)?.end).toEqual(now);
    sorted.slice(1).forEach((range, index) =>
      expect(range.start.getTime()).toBeGreaterThan(
        sorted[index]?.end.getTime() ?? 0,
      )
    );
  });
});
