import { describe, expect, it } from 'vitest';
import { starsFromRects } from './starsFromRects.ts';

// Five 20px-wide stars laid out edge to edge: [0,20], [20,40], ... [80,100].
const STAR_RECTS = Array.from({ length: 5 }, (_, index) => ({
  left: index * 20,
  right: index * 20 + 20,
  width: 20,
}));

const measure = (
  clientX: number,
  overrides: Partial<Parameters<typeof starsFromRects>[0]> = {},
) =>
  starsFromRects({
    rects: STAR_RECTS,
    clientX,
    allowHalf: true,
    isRtl: false,
    max: 5,
    ...overrides,
  });

describe('util: starsFromRects', () => {
  it('should return null when there are no rects', () => {
    expect(measure(10, { rects: [] })).toBeNull();
  });

  describe('half ratings (LTR)', () => {
    it('should clamp to a half star before the first star', () => {
      expect(measure(-5)).toBe(0.5);
    });

    it('should clamp to the max past the last star', () => {
      expect(measure(150)).toBe(5);
    });

    it('should return a half when the pointer is over a star left half', () => {
      expect(measure(5)).toBe(0.5);
      expect(measure(25)).toBe(1.5);
    });

    it('should return a whole when the pointer is over a star right half', () => {
      expect(measure(15)).toBe(1);
      expect(measure(38)).toBe(2);
    });
  });

  describe('whole-only ratings', () => {
    it('should never return a half when allowHalf is false', () => {
      expect(measure(5, { allowHalf: false })).toBe(1);
      expect(measure(25, { allowHalf: false })).toBe(2);
    });

    it('should clamp to a whole star before the first star', () => {
      expect(measure(-5, { allowHalf: false })).toBe(1);
    });
  });

  describe('gaps between stars', () => {
    // Stars with a 4px gap: [0,20], [24,44]. clientX 22 lands in the gap.
    const GAPPED = [
      { left: 0, right: 20, width: 20 },
      { left: 24, right: 44, width: 20 },
    ];

    it('should resolve to the nearest star instead of returning null', () => {
      expect(starsFromRects({
        rects: GAPPED,
        clientX: 21,
        allowHalf: true,
        isRtl: false,
        max: 2,
      })).not.toBeNull();
    });

    it('should pick the star whose center is closest', () => {
      // 21 is nearer star 0's center (10) than star 1's (34) -> full star 1.
      expect(starsFromRects({
        rects: GAPPED,
        clientX: 21,
        allowHalf: true,
        isRtl: false,
        max: 2,
      })).toBe(1);
      // 26 is nearer star 1's center -> its near (left) half.
      expect(starsFromRects({
        rects: GAPPED,
        clientX: 26,
        allowHalf: true,
        isRtl: false,
        max: 2,
      })).toBe(1.5);
    });
  });

  describe('RTL', () => {
    it('should flip the clamp ends', () => {
      expect(measure(-5, { isRtl: true })).toBe(5);
      expect(measure(150, { isRtl: true })).toBe(0.5);
    });

    it('should read the half from the opposite side of the star', () => {
      // clientX 15 sits in the right 25% of star 0; in RTL that is its near
      // (low) half.
      expect(measure(15, { isRtl: true })).toBe(0.5);
      expect(measure(5, { isRtl: true })).toBe(1);
    });
  });
});
