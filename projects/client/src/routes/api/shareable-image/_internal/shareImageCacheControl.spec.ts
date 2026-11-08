import { time } from '$lib/utils/timing/time.ts';
import { describe, expect, it } from 'vitest';
import { shareImageCacheControl } from './shareImageCacheControl.ts';

describe('util: shareImageCacheControl', () => {
  it('should let the edge and browsers cache for the time to live', () => {
    expect(shareImageCacheControl(time.hours(12))).toBe(
      'public, max-age=43200, s-maxage=43200',
    );
  });

  it('should cap the browser cache at 7 days', () => {
    expect(shareImageCacheControl(time.days(30))).toBe(
      'public, max-age=604800, s-maxage=2592000',
    );
  });

  it('should never send a negative age', () => {
    expect(shareImageCacheControl(-time.hours(1))).toBe(
      'public, max-age=0, s-maxage=0',
    );
  });
});
