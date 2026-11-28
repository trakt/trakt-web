import { describe, expect, it } from 'vitest';
import { slamTimings } from './slamTimings.ts';

describe('util: slamTimings', () => {
  it('should end after every letter has dropped plus a settle buffer', () => {
    expect(slamTimings('abcd').endAt).toBe(4 * 34 + 300 + 500);
  });

  it('should ignore whitespace when counting letters', () => {
    expect(slamTimings('a b  c')).toEqual(slamTimings('abc'));
  });

  it('should hit the impact at 70 percent of the drop after the last letter starts', () => {
    expect(slamTimings('abcd').impactAt).toBe(4 * 34 + 300 * 0.7);
  });

  it('should cap the impact delay at eighteen letters', () => {
    const long = slamTimings('a'.repeat(40));

    expect(long.impactAt).toBe(18 * 34 + 300 * 0.7);
    expect(long.endAt).toBe(40 * 34 + 300 + 500);
  });

  it('should count astral characters as single letters', () => {
    expect(slamTimings('😀😀').endAt).toBe(slamTimings('ab').endAt);
  });
});
