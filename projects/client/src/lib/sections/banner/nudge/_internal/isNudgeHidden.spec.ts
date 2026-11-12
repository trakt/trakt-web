import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { isNudgeHidden } from './isNudgeHidden.ts';

const HIDDEN_AT = Date.UTC(2026, 0, 10, 12);

const after = (elapsed: number) => ({
  hiddenAt: String(HIDDEN_AT),
  now: HIDDEN_AT + elapsed,
});

describe('util: isNudgeHidden', () => {
  it('should be hidden right after the dismissal', () => {
    expect(isNudgeHidden(after(0))).toBe(true);
  });

  it('should be hidden on the day of the dismissal', () => {
    expect(isNudgeHidden(after(time.hours(23)))).toBe(true);
  });

  it('should be hidden on day 13', () => {
    expect(isNudgeHidden(after(time.days(13)))).toBe(true);
  });

  it('should be hidden until the full 14 days have passed', () => {
    expect(isNudgeHidden(after(time.days(14) - 1))).toBe(true);
  });

  it('should be shown again after 14 days', () => {
    expect(isNudgeHidden(after(time.days(14)))).toBe(false);
    expect(isNudgeHidden(after(time.days(30)))).toBe(false);
  });

  it('should be shown when nothing is stored', () => {
    expect(isNudgeHidden({ hiddenAt: null, now: HIDDEN_AT })).toBe(false);
    expect(isNudgeHidden({ hiddenAt: undefined, now: HIDDEN_AT })).toBe(false);
    expect(isNudgeHidden({ hiddenAt: '', now: HIDDEN_AT })).toBe(false);
  });

  it('should be shown when the stored value is junk', () => {
    expect(isNudgeHidden({ hiddenAt: 'yesterday', now: HIDDEN_AT })).toBe(
      false,
    );
    expect(isNudgeHidden({ hiddenAt: '{}', now: HIDDEN_AT })).toBe(false);
  });

  it('should be shown when the stored time is in the future', () => {
    expect(isNudgeHidden(after(-time.days(1)))).toBe(false);
  });
});
