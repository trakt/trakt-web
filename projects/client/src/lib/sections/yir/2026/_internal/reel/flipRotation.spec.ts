import { describe, expect, it } from 'vitest';
import { flipRotation } from './flipRotation.ts';

describe('util: flipRotation', () => {
  it('should never rotate a card without a runner-up', () => {
    expect(flipRotation(0.6, false)).toBe(0);
    expect(flipRotation(1, false)).toBe(0);
  });

  it('should show the runner-up face until the flip starts', () => {
    expect(flipRotation(0.3, true)).toBe(0);
  });

  it('should be halfway through the flip mid-span', () => {
    expect(flipRotation(0.6, true)).toBeCloseTo(90);
  });

  it('should land on the primary face', () => {
    expect(flipRotation(0.75, true)).toBe(180);
    expect(flipRotation(1, true)).toBe(180);
  });
});
