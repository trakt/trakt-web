import { describe, expect, it } from 'vitest';
import './toSorted.ts';

describe('Array.prototype.toSorted polyfill', () => {
  it('returns a sorted copy without mutating the source', () => {
    const source = [3, 1, 2];
    const sorted = source.toSorted();

    expect(sorted).toEqual([1, 2, 3]);
    expect(source).toEqual([3, 1, 2]);
  });

  it('applies a custom comparator', () => {
    const sorted = [1, 2, 3].toSorted((a, b) => b - a);

    expect(sorted).toEqual([3, 2, 1]);
  });
});
