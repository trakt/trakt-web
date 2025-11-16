import { describe, expect, it } from 'vitest';
import { getDeviceType } from './getDeviceType.ts';

describe('getDeviceType', () => {
  it('should return "unknown" when userAgent is null', () => {
    expect(getDeviceType(null)).toBe('unknown');
  });

  it('should return "unknown" when userAgent is undefined', () => {
    expect(getDeviceType(undefined)).toBe('unknown');
  });

  it('should return "mobile" for Android user agents', () => {
    const androidUserAgent =
      'Mozilla/5.0 (Linux; Android 12; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36';
    expect(getDeviceType(androidUserAgent)).toBe('mobile');
  });

  it('should return "mobile" for iOS user agents', () => {
    const iosUserAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
    expect(getDeviceType(iosUserAgent)).toBe('mobile');
  });

  it('should return "mobile" for iPad user agents', () => {
    const iPadUserAgent =
      'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
    expect(getDeviceType(iPadUserAgent)).toBe('mobile');
  });

  it('should return "unknown" for desktop user agents', () => {
    const desktopUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    expect(getDeviceType(desktopUserAgent)).toBe('unknown');
  });

  it('should return "unknown" for Mac user agents', () => {
    const macUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    expect(getDeviceType(macUserAgent)).toBe('unknown');
  });
});
