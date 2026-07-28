import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { isAnchorStale } from './isAnchorStale.ts';

describe('util: isAnchorStale', () => {
  const anchoredAt = Date.parse('2026-07-28T17:35:07.071Z');

  it('should treat a just-received response as fresh', () => {
    expect(isAnchorStale({ anchoredAt, now: anchoredAt })).toBe(false);
  });

  it('should keep a normal poll cadence fresh', () => {
    expect(isAnchorStale({ anchoredAt, now: anchoredAt + time.seconds(10) }))
      .toBe(false);
  });

  it('should still be fresh just inside the window', () => {
    expect(isAnchorStale({
      anchoredAt,
      now: anchoredAt + time.minutes(5) - 1,
    })).toBe(false);
  });

  it('should go stale once polling has clearly stopped', () => {
    expect(isAnchorStale({ anchoredAt, now: anchoredAt + time.minutes(6) }))
      .toBe(true);
  });

  it('should not be stale when the client clock lags the server', () => {
    expect(isAnchorStale({ anchoredAt, now: anchoredAt - time.minutes(30) }))
      .toBe(false);
  });
});
