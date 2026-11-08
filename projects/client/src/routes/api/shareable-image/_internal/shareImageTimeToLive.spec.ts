import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { shareImageTimeToLive } from './shareImageTimeToLive.ts';

const NOW = new Date('2026-11-08T12:00:00Z').getTime();

function timeToLiveFor({ releasedDaysAgo = 0, cachedMsAgo = 0 }) {
  return shareImageTimeToLive({
    cachedAt: NOW - cachedMsAgo,
    releasedAt: NOW - time.days(releasedDaysAgo),
    now: NOW,
  });
}

describe('util: shareImageTimeToLive', () => {
  it('should keep a fresh new release for 12 hours', () => {
    expect(timeToLiveFor({ releasedDaysAgo: 2 })).toBe(time.hours(12));
  });

  it('should treat an upcoming release as a new release', () => {
    expect(timeToLiveFor({ releasedDaysAgo: -30 })).toBe(time.hours(12));
  });

  it('should keep an old release for 30 days', () => {
    expect(timeToLiveFor({ releasedDaysAgo: 400 })).toBe(time.days(30));
  });

  it('should subtract the time already spent in the cache', () => {
    expect(
      timeToLiveFor({ releasedDaysAgo: 30, cachedMsAgo: time.days(1) }),
    ).toBe(time.days(2));
  });

  it('should go negative once the image is stale', () => {
    expect(
      timeToLiveFor({ releasedDaysAgo: 2, cachedMsAgo: time.hours(13) }),
    ).toBeLessThan(0);
  });
});
