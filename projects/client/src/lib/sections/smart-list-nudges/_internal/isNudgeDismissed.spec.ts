import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { isNudgeDismissed } from './isNudgeDismissed.ts';

const NOW = 1_000_000_000_000;

describe('isNudgeDismissed', () => {
  it('is not dismissed without a record', () => {
    expect(
      isNudgeDismissed({ record: undefined, now: NOW, maxDismissals: 2 }),
    ).toBe(false);
  });

  it('stays dismissed inside the 14 day window', () => {
    const record = { dismissedAt: NOW - time.days(13), count: 1 };

    expect(isNudgeDismissed({ record, now: NOW, maxDismissals: 2 })).toBe(true);
  });

  it('comes back once the window has passed', () => {
    const record = { dismissedAt: NOW - time.days(14), count: 1 };

    expect(isNudgeDismissed({ record, now: NOW, maxDismissals: 2 })).toBe(
      false,
    );
  });

  it('never comes back after the dismissal cap', () => {
    const record = { dismissedAt: NOW - time.days(365), count: 2 };

    expect(isNudgeDismissed({ record, now: NOW, maxDismissals: 2 })).toBe(true);
  });

  it('ignores the cap when there is none', () => {
    const record = { dismissedAt: NOW - time.days(30), count: 9 };

    expect(
      isNudgeDismissed({
        record,
        now: NOW,
        maxDismissals: Number.POSITIVE_INFINITY,
      }),
    ).toBe(false);
  });
});
