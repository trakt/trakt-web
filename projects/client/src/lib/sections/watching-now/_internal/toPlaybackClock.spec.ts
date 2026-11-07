import { describe, expect, it } from 'vitest';
import { time } from '$lib/utils/timing/time.ts';
import { toPlaybackClock } from './toPlaybackClock.ts';

describe('util: toPlaybackClock', () => {
  it('should format under an hour as minutes and seconds', () => {
    expect(toPlaybackClock(time.minutes(32) + time.seconds(7))).toBe('32:07');
  });

  it('should format an hour or more with padded minutes', () => {
    expect(
      toPlaybackClock(time.hours(1) + time.minutes(1) + time.seconds(53)),
    ).toBe('1:01:53');
  });

  it('should drop partial seconds', () => {
    expect(toPlaybackClock(time.seconds(5) + 999)).toBe('0:05');
  });

  it('should never go below zero', () => {
    expect(toPlaybackClock(-time.seconds(30))).toBe('0:00');
  });
});
