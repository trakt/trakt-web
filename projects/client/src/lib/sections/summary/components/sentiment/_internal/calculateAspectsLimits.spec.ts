import { describe, expect, it } from 'vitest';
import { calculateAspectsLimit } from './calculateAspectsLimit.ts';

describe('calculateAspectsLimit', () => {
  it('returns 4 when average aspect length is below the threshold', () => {
    const pros = ['Great acting', 'Good pacing'];
    const cons = ['Slow start'];

    expect(calculateAspectsLimit(pros, cons)).toBe(4);
  });

  it('returns 4 when average aspect length equals the threshold', () => {
    const thirtyFiveChars = 'a'.repeat(35);
    const pros = [thirtyFiveChars];
    const cons: string[] = [];
    expect(calculateAspectsLimit(pros, cons)).toBe(4);
  });

  it('returns 3 when average aspect length exceeds the threshold', () => {
    const longAspect = 'a'.repeat(36);
    const pros = [longAspect];
    const cons: string[] = [];
    expect(calculateAspectsLimit(pros, cons)).toBe(3);
  });

  it('returns 3 when average of mixed pros and cons exceeds the threshold', () => {
    const pros = ['Exceptionally well-crafted cinematography'];
    const cons = ['The narrative pacing felt inconsistent throughout'];
    expect(calculateAspectsLimit(pros, cons)).toBe(3);
  });

  it('returns 4 when only pros are provided and they are short', () => {
    const pros = ['Fun', 'Fast', 'Great'];
    const cons: string[] = [];
    expect(calculateAspectsLimit(pros, cons)).toBe(4);
  });

  it('returns 4 when only cons are provided and they are short', () => {
    const pros: string[] = [];
    const cons = ['Boring', 'Too long'];
    expect(calculateAspectsLimit(pros, cons)).toBe(4);
  });
});
