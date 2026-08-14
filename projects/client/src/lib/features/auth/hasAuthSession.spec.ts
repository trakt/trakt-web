import { describe, expect, it } from 'vitest';
import { hasAuthSession } from './hasAuthSession.ts';

describe('util: hasAuthSession', () => {
  it('should return false when there is no cookie', () => {
    expect(hasAuthSession(null)).toBe(false);
    expect(hasAuthSession(undefined)).toBe(false);
  });

  it('should return false when the cookie carries no token', () => {
    expect(hasAuthSession({ token: null, expiresAt: 1 })).toBe(false);
  });

  it('should return true regardless of expiry', () => {
    expect(hasAuthSession({ token: 'token', expiresAt: null })).toBe(true);
    expect(hasAuthSession({ token: 'token', expiresAt: 0 })).toBe(true);
  });
});
