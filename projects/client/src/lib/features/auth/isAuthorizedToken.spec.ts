import { describe, expect, it } from 'vitest';
import { isAuthorizedToken } from './isAuthorizedToken.ts';

const NOW = 1_000_000;

describe('util: isAuthorizedToken', () => {
  it('should reject a missing cookie', () => {
    expect(isAuthorizedToken(null, NOW)).toBe(false);
    expect(isAuthorizedToken(undefined, NOW)).toBe(false);
  });

  it('should reject a cookie without a token', () => {
    expect(
      isAuthorizedToken({ token: null, expiresAt: NOW + 1 }, NOW),
    ).toBe(false);
  });

  it('should reject a cookie without an expiry', () => {
    expect(
      isAuthorizedToken({ token: 'token', expiresAt: null }, NOW),
    ).toBe(false);
  });

  it('should reject an expired token', () => {
    expect(
      isAuthorizedToken({ token: 'token', expiresAt: NOW - 1 }, NOW),
    ).toBe(false);
  });

  it('should reject a token expiring exactly now', () => {
    expect(
      isAuthorizedToken({ token: 'token', expiresAt: NOW }, NOW),
    ).toBe(false);
  });

  it('should accept an unexpired token', () => {
    expect(
      isAuthorizedToken({ token: 'token', expiresAt: NOW + 1 }, NOW),
    ).toBe(true);
  });
});
