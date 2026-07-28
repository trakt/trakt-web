import { describe, expect, it } from 'vitest';
import { toDigitPosition } from './toDigitPosition.ts';

describe('util: toDigitPosition', () => {
  describe('for the ones column', () => {
    it('should rest flush on an exact value', () => {
      expect(toDigitPosition({ value: 17_002_054, place: 0 })).toBe(4);
    });

    it('should still rest flush at the midpoint of its step', () => {
      expect(toDigitPosition({ value: 100.5, place: 0 })).toBe(0);
    });

    it('should travel through the second half of its step', () => {
      expect(toDigitPosition({ value: 100.75, place: 0 })).toBeCloseTo(0.5, 6);
    });

    it('should settle onto the next digit as the step completes', () => {
      expect(toDigitPosition({ value: 100.999, place: 0 }))
        .toBeGreaterThan(0.99);
      expect(toDigitPosition({ value: 101, place: 0 })).toBe(1);
    });

    it('should wrap from nine to the repeated strip origin', () => {
      expect(toDigitPosition({ value: 109.99, place: 0 }))
        .toBeGreaterThan(9.99);
      expect(toDigitPosition({ value: 110, place: 0 })).toBe(0);
    });
  });

  describe('for columns above the ones', () => {
    it('should rest flush while the column below is mid-step', () => {
      expect(toDigitPosition({ value: 17_002_054.4, place: 1 })).toBe(5);
    });

    it('should stay flush until the carry window opens', () => {
      expect(toDigitPosition({ value: 17_002_057, place: 1 })).toBe(5);
    });

    it('should travel through the carry window', () => {
      // Dividing a 17M value down loses low-order bits, so this is compared at
      // far more precision than a sub-pixel roll offset needs.
      expect(toDigitPosition({ value: 17_002_059, place: 1 }))
        .toBeCloseTo(5.5, 5);
    });

    it('should land flush on the next digit after the carry', () => {
      expect(toDigitPosition({ value: 17_002_060, place: 1 })).toBe(6);
    });

    it('should hold a high column flush across a low-column carry', () => {
      expect(toDigitPosition({ value: 17_002_059, place: 5 })).toBe(0);
    });
  });

  it('should stay within a single strip revolution', () => {
    expect(toDigitPosition({ value: 17_002_054, place: 7 })).toBeLessThan(10);
  });

  it('should clamp a negative value to the strip origin', () => {
    expect(toDigitPosition({ value: -5, place: 0 })).toBe(0);
  });
});
