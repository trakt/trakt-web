import { describe, expect, it } from 'vitest';
import { toShareImageRoute } from './toShareImageRoute.ts';

describe('util: toShareImageRoute', () => {
  it('should route the legacy month in review image to the share endpoint', () => {
    expect(toShareImageRoute('/users/sean/mir.jpg')).toBe(
      '/api/shareable-image/mir/sean',
    );
  });

  it('should route the legacy year in review image to the share endpoint', () => {
    expect(toShareImageRoute('/users/sean/yir.jpg')).toBe(
      '/api/shareable-image/yir/sean',
    );
  });

  it('should leave other images under a user alone', () => {
    expect(toShareImageRoute('/users/sean/avatar.jpg')).toBeUndefined();
  });

  it('should leave the month in review page alone', () => {
    expect(toShareImageRoute('/users/sean/mir/2026/10')).toBeUndefined();
  });

  it('should route dotted usernames', () => {
    expect(toShareImageRoute('/users/mike.d/mir.jpg')).toBe(
      '/api/shareable-image/mir/mike.d',
    );
  });

  it('should ignore slugs with unexpected characters', () => {
    expect(toShareImageRoute('/users/../mir.jpg')).toBeUndefined();
    expect(toShareImageRoute('/users/se%20an/mir.jpg')).toBeUndefined();
  });
});
