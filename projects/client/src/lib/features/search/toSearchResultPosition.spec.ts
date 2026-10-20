import { describe, expect, it } from 'vitest';
import { toSearchResultPosition } from './toSearchResultPosition.ts';

describe('util: toSearchResultPosition', () => {
  it.each([
    [1, '1-3'],
    [3, '1-3'],
    [4, '4-10'],
    [10, '4-10'],
    [11, '11+'],
    [250, '11+'],
  ])('should bucket position %i as %s', (position, expected) => {
    expect(toSearchResultPosition(position)).toBe(expected);
  });
});
