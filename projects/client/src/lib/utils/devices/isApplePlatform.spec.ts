import { describe, expect, it } from 'vitest';
import { isApplePlatform } from './isApplePlatform.ts';

describe('util: isApplePlatform', () => {
  it('should return true for Apple platforms', () => {
    ['MacIntel', 'iPhone', 'iPad', 'iPod'].forEach((platform) => {
      expect(isApplePlatform(platform)).toBe(true);
    });
  });

  it('should return false for other platforms', () => {
    ['Win32', 'Linux x86_64', 'Linux armv8l'].forEach((platform) => {
      expect(isApplePlatform(platform)).toBe(false);
    });
  });

  it('should return false for missing platforms', () => {
    expect(isApplePlatform(null)).toBe(false);
    expect(isApplePlatform(undefined)).toBe(false);
    expect(isApplePlatform('')).toBe(false);
  });
});
