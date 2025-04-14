import { describe, expect, it } from 'vitest';
import { getNextIndex } from './getNextIndex.ts';

describe('getNextIndex', () => {
  it('should return the next index when moving forward', () => {
    expect(getNextIndex(0, 5, true)).toBe(1);
    expect(getNextIndex(2, 5, true)).toBe(3);
  });

  it('should not exceed the maximum index when moving forward', () => {
    expect(getNextIndex(4, 5, true)).toBe(4);
  });

  it('should return the previous index when moving backward', () => {
    expect(getNextIndex(4, 5, false)).toBe(3);
    expect(getNextIndex(2, 5, false)).toBe(1);
  });

  it('should not go below zero when moving backward', () => {
    expect(getNextIndex(0, 5, false)).toBe(0);
  });
});
