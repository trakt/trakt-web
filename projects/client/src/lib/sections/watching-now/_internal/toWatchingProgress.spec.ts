import { describe, expect, it } from 'vitest';
import { time } from '$lib/utils/timing/time.ts';
import { toWatchingProgress } from './toWatchingProgress.ts';

const startedAt = new Date('2026-11-05T20:00:00Z');
const expiresAt = new Date('2026-11-05T21:00:00Z');

describe('util: toWatchingProgress', () => {
  it('should report the fraction, time elapsed and time left', () => {
    const now = new Date('2026-11-05T20:15:00Z').getTime();

    expect(toWatchingProgress({ startedAt, expiresAt, now })).toEqual({
      fraction: 0.25,
      elapsed: time.minutes(15),
      remaining: time.minutes(45),
    });
  });

  it('should clamp before the start and after the end', () => {
    const before = new Date('2026-11-05T19:00:00Z').getTime();
    const after = new Date('2026-11-05T22:00:00Z').getTime();

    expect(toWatchingProgress({ startedAt, expiresAt, now: before })).toEqual({
      fraction: 0,
      elapsed: 0,
      remaining: time.minutes(60),
    });
    expect(toWatchingProgress({ startedAt, expiresAt, now: after })).toEqual({
      fraction: 1,
      elapsed: time.minutes(60),
      remaining: 0,
    });
  });

  it('should treat an empty window as finished', () => {
    expect(
      toWatchingProgress({
        startedAt,
        expiresAt: startedAt,
        now: startedAt.getTime(),
      }),
    ).toEqual({ fraction: 1, elapsed: 0, remaining: 0 });
  });
});
