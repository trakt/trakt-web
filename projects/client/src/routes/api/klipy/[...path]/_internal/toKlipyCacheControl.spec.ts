import { describe, expect, it } from 'vitest';
import { toKlipyCacheControl } from './toKlipyCacheControl.ts';

describe('util: toKlipyCacheControl', () => {
  it('should cache the reads that are the same for everyone', () => {
    expect(toKlipyCacheControl('gifs/trending')).toBe('public, max-age=600');
    expect(toKlipyCacheControl('gifs/search')).toBe('public, max-age=600');
    expect(toKlipyCacheControl('gifs/categories')).toBe(
      'public, max-age=43200',
    );
  });

  it('should never cache the per device reads', () => {
    expect(toKlipyCacheControl('gifs/recent')).toBe('no-store');
  });

  it('should refuse a path we do not proxy', () => {
    expect(toKlipyCacheControl('stickers/trending')).toBeNull();
    expect(toKlipyCacheControl('gifs/share/some-slug')).toBeNull();
    expect(toKlipyCacheControl('')).toBeNull();
  });

  it('should refuse a path that tries to climb out', () => {
    expect(toKlipyCacheControl('gifs/../../account')).toBeNull();
    expect(toKlipyCacheControl('../gifs/trending')).toBeNull();
  });
});
