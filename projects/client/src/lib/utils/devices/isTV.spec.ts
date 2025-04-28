import { describe, expect, it } from 'vitest';
import { isTV } from './isTV.ts';

describe('isTV', () => {
  it('should return false when userAgent is null', () => {
    expect(isTV(null)).toBe(false);
  });

  it('should return false when userAgent is undefined', () => {
    expect(isTV(undefined)).toBe(false);
  });

  it('should return true for Android TV user agents', () => {
    const androidTvUserAgent =
      'Mozilla/5.0 (Linux; Android 9; ANDROIDTV DEVICE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36';
    expect(isTV(androidTvUserAgent)).toBe(true);
  });

  it('should return false for regular Android user agents without TV', () => {
    const androidUserAgent =
      'Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36';
    expect(isTV(androidUserAgent)).toBe(false);
  });

  it('should return false for non-Android user agents', () => {
    const iosUserAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';
    const desktopUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    expect(isTV(iosUserAgent)).toBe(false);
    expect(isTV(desktopUserAgent)).toBe(false);
  });
});
