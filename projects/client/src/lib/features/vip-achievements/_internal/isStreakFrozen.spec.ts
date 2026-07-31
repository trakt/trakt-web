import { describe, expect, it } from 'vitest';
import { GRACE_PERIOD_MS } from './constants.ts';
import { isStreakFrozen } from './isStreakFrozen.ts';

describe('util: isStreakFrozen', () => {
  const now = new Date('2026-07-30T00:00:00.000Z').getTime();

  it('should not freeze while the membership is still active', () => {
    const expiresAt = new Date(now + GRACE_PERIOD_MS);

    expect(isStreakFrozen({ expiresAt, now })).toBe(false);
  });

  it('should freeze within the grace window after expiry', () => {
    const expiresAt = new Date(now - GRACE_PERIOD_MS / 2);

    expect(isStreakFrozen({ expiresAt, now })).toBe(true);
  });

  it('should freeze exactly at the edge of the grace window', () => {
    const expiresAt = new Date(now - GRACE_PERIOD_MS);

    expect(isStreakFrozen({ expiresAt, now })).toBe(true);
  });

  it('should stop freezing once the grace window has elapsed', () => {
    const expiresAt = new Date(now - GRACE_PERIOD_MS - 1);

    expect(isStreakFrozen({ expiresAt, now })).toBe(false);
  });

  it('should not freeze when there is no expiry date', () => {
    expect(isStreakFrozen({ expiresAt: null, now })).toBe(false);
  });

  it('should not freeze on an invalid expiry date', () => {
    expect(isStreakFrozen({ expiresAt: new Date('nope'), now })).toBe(false);
  });
});
