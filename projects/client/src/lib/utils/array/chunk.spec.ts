import { describe, expect, it } from 'vitest';
import { chunk } from './chunk.ts';

describe('chunk', () => {
  it('should split an array into chunks of the given size', () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
  });

  it('should include a smaller final chunk when the array is not evenly divisible', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should return one chunk when size is larger than the array', () => {
    expect(chunk([1, 2, 3], 10)).toEqual([[1, 2, 3]]);
  });

  it('should return an empty array for an empty input', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('should handle a chunk size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it('should work with non-primitive elements', () => {
    const elementA = { id: 1 };
    const elementB = { id: 2 };
    const elementC = { id: 3 };

    expect(chunk([elementA, elementB, elementC], 2)).toEqual([[
      elementA,
      elementB,
    ], [elementC]]);
  });
});
