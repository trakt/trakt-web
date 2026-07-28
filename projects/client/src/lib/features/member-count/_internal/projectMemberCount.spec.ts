import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { projectMemberCount } from './projectMemberCount.ts';

describe('util: projectMemberCount', () => {
  const anchor = {
    total: 17_002_054,
    anchoredAt: Date.parse('2026-07-28T17:35:07.071Z'),
    ratePerDay: 8_640, // exactly one signup per 10 seconds
  };

  it('should return the authoritative total at the anchor instant', () => {
    expect(projectMemberCount({ anchor, now: anchor.anchoredAt }))
      .toBe(anchor.total);
  });

  it('should project forward at the measured rate', () => {
    const now = anchor.anchoredAt + time.seconds(50);

    expect(projectMemberCount({ anchor, now })).toBe(anchor.total + 5);
  });

  it('should never project below the total when the client clock lags', () => {
    const now = anchor.anchoredAt - time.minutes(30);

    expect(projectMemberCount({ anchor, now })).toBe(anchor.total);
  });

  it('should stop projecting once the anchor is too stale to trust', () => {
    const capped = projectMemberCount({
      anchor,
      now: anchor.anchoredAt + time.minutes(5),
    });

    expect(projectMemberCount({
      anchor,
      now: anchor.anchoredAt + time.days(1),
    })).toBe(capped);
  });

  it('should hold still for a zero rate', () => {
    expect(projectMemberCount({
      anchor: { ...anchor, ratePerDay: 0 },
      now: anchor.anchoredAt + time.minutes(1),
    })).toBe(anchor.total);
  });
});
