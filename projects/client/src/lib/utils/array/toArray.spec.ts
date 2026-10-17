import { describe, expect, it } from 'vitest';
import { toArray } from './toArray.ts';

describe('util: toArray', () => {
  it('should return an array as is', () => {
    const input = [1, 2];
    expect(toArray(input)).toBe(input);
  });

  it('should wrap a single value', () => {
    expect(toArray(1)).toEqual([1]);
  });
});
