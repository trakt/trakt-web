import { describe, expect, it } from 'vitest';
import { toRasterMime } from './toRasterMime.ts';

describe('util: toRasterMime', () => {
  it('should map each format to its mime type', () => {
    expect(toRasterMime('png')).toBe('image/png');
    expect(toRasterMime('jpg')).toBe('image/jpeg');
    expect(toRasterMime('webp')).toBe('image/webp');
  });
});
