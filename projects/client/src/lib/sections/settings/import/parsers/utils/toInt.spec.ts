import { describe, expect, it } from 'vitest';
import { toInt } from './toInt.ts';

describe('util: toInt', () => {
  it('should parse a base 10 integer', () => {
    expect(toInt('42')).toBe(42);
    expect(toInt('08')).toBe(8);
    expect(toInt('12abc')).toBe(12);
  });

  it('should return undefined for empty or unparseable values', () => {
    expect(toInt(undefined)).toBeUndefined();
    expect(toInt('')).toBeUndefined();
    expect(toInt('abc')).toBeUndefined();
  });
});
