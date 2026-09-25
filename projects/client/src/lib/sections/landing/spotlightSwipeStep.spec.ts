import { describe, expect, it } from 'vitest';
import { spotlightSwipeStep } from './spotlightSwipeStep.ts';

describe('util: spotlightSwipeStep', () => {
  it('should step forward on a tap', () => {
    expect(spotlightSwipeStep({ dx: 0, isTap: true, isRtl: false })).toBe(1);
  });

  it('should not step for a short drag', () => {
    expect(spotlightSwipeStep({ dx: -20, isTap: false, isRtl: false })).toBe(
      0,
    );
  });

  it('should step forward when swiping towards the start', () => {
    expect(spotlightSwipeStep({ dx: -80, isTap: false, isRtl: false })).toBe(
      1,
    );
  });

  it('should step back when swiping towards the end', () => {
    expect(spotlightSwipeStep({ dx: 80, isTap: false, isRtl: false })).toBe(
      -1,
    );
  });

  it('should mirror the swipe direction in rtl', () => {
    expect(spotlightSwipeStep({ dx: 80, isTap: false, isRtl: true })).toBe(1);
    expect(spotlightSwipeStep({ dx: -80, isTap: false, isRtl: true })).toBe(
      -1,
    );
  });
});
