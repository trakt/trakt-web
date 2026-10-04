import { describe, expect, it } from 'vitest';
import { getDayRange } from './getDayRange.ts';

const now = new Date(2026, 8, 28, 14, 0);

describe('util: getDayRange', () => {
  it('should use the last 24 hours for today', () => {
    const range = getDayRange({ dayKey: '2026-09-28', now });

    expect(range.end).toEqual(now);
    expect(range.start).toEqual(new Date(2026, 8, 27, 14, 0));
  });

  it('should fall back to the last 24 hours without a day', () => {
    expect(getDayRange({ dayKey: null, now }).end).toEqual(now);
  });

  it('should cover the whole calendar day for yesterday', () => {
    const range = getDayRange({ dayKey: '2026-09-27', now });

    expect(range.start).toEqual(new Date(2026, 8, 27, 0, 0, 0, 0));
    expect(range.end).toEqual(new Date(2026, 8, 27, 23, 59, 59, 999));
  });

  it('should cover the last seven calendar days for the past week', () => {
    const range = getDayRange({ dayKey: 'week', now });

    expect(range.start).toEqual(new Date(2026, 8, 22, 0, 0, 0, 0));
    expect(range.end).toEqual(now);
    expect(range.isRolling).toBe(false);
  });

  it('should ignore days that are not offered', () => {
    expect(getDayRange({ dayKey: '2026-09-01', now }).end).toEqual(now);
  });
});
