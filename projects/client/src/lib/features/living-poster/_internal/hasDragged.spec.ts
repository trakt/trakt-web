import { describe, expect, it } from 'vitest';
import { hasDragged } from './hasDragged.ts';

describe('util: hasDragged', () => {
  it('should ignore a finger that has not moved', () => {
    expect(hasDragged({ x: 0, y: 0 })).toBe(false);
  });

  it('should ignore the slop of a tap', () => {
    expect(hasDragged({ x: 0.04, y: 0.03 })).toBe(false);
  });

  it('should count a sideways drag', () => {
    expect(hasDragged({ x: -0.3, y: 0 })).toBe(true);
  });

  it('should count a drag that only moved vertically', () => {
    expect(hasDragged({ x: 0, y: 0.2 })).toBe(true);
  });

  it('should count a diagonal drag that is small on each axis', () => {
    expect(hasDragged({ x: 0.08, y: 0.08 })).toBe(true);
  });
});
