import { describe, expect, it } from 'vitest';
import { toReorderIndex } from './toReorderIndex.ts';

// Three 100px segments starting at x=0.
const segments = [
  { left: 0, width: 100 },
  { left: 100, width: 100 },
  { left: 200, width: 100 },
];

describe('util: toReorderIndex', () => {
  it('should report the slot the pointer sits in', () => {
    expect(toReorderIndex({ segments, pointerX: 10 })).toBe(0);
    expect(toReorderIndex({ segments, pointerX: 140 })).toBe(1);
    expect(toReorderIndex({ segments, pointerX: 240 })).toBe(2);
  });

  it('should switch slot at the midpoint, not at the edge', () => {
    expect(toReorderIndex({ segments, pointerX: 49 })).toBe(0);
    expect(toReorderIndex({ segments, pointerX: 51 })).toBe(1);
  });

  it('should park at the first slot when dragged off the start', () => {
    expect(toReorderIndex({ segments, pointerX: -500 })).toBe(0);
  });

  it('should park at the last slot when dragged off the end', () => {
    expect(toReorderIndex({ segments, pointerX: 5000 })).toBe(2);
  });

  it('should stay at zero without segments to measure', () => {
    expect(toReorderIndex({ segments: [], pointerX: 42 })).toBe(0);
  });

  describe('right to left', () => {
    // The same three segments, laid out with the first option on the right.
    const rtlSegments = [
      { left: 200, width: 100 },
      { left: 100, width: 100 },
      { left: 0, width: 100 },
    ];

    it('should report the option sitting under the pointer', () => {
      expect(toReorderIndex({ segments: rtlSegments, pointerX: 240 })).toBe(0);
      expect(toReorderIndex({ segments: rtlSegments, pointerX: 140 })).toBe(1);
      expect(toReorderIndex({ segments: rtlSegments, pointerX: 10 })).toBe(2);
    });

    it('should park at the last option when dragged off the start', () => {
      expect(toReorderIndex({ segments: rtlSegments, pointerX: -500 })).toBe(2);
    });

    it('should park at the first option when dragged off the end', () => {
      expect(toReorderIndex({ segments: rtlSegments, pointerX: 5000 })).toBe(0);
    });
  });
});
