import { describe, expect, it } from 'vitest';
import { toShareImageRoute } from './toShareImageRoute.ts';

describe('util: toShareImageRoute', () => {
  it('should route the legacy month in review image to the share endpoint', () => {
    expect(toShareImageRoute('/users/sean/mir.jpg')).toBe(
      '/api/shareable-image/mir/sean',
    );
  });

  it('should leave the month in review page alone', () => {
    expect(toShareImageRoute('/users/sean/mir/2026/10')).toBeUndefined();
  });

  it('should ignore slugs with unexpected characters', () => {
    expect(toShareImageRoute('/users/se.an/mir.jpg')).toBeUndefined();
  });
});
