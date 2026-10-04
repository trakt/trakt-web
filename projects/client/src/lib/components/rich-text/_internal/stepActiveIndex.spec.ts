import { describe, expect, it } from 'vitest';
import { stepActiveIndex } from './stepActiveIndex.ts';

describe('util: stepActiveIndex', () => {
  it.each([
    ['down to the next option', 'ArrowDown', 0, 1],
    ['up to the previous option', 'ArrowUp', 2, 1],
    ['down from the last option to the first', 'ArrowDown', 2, 0],
    ['up from the first option to the last', 'ArrowUp', 0, 2],
  ])('should move %s', (_, key, activeIndex, expected) => {
    expect(stepActiveIndex({ key, activeIndex, count: 3 })).toBe(expected);
  });

  it('should ignore keys other than the arrows', () => {
    expect(stepActiveIndex({ key: 'Enter', activeIndex: 0, count: 3 }))
      .toBeNull();
  });

  it('should ignore arrows when there are no options', () => {
    expect(stepActiveIndex({ key: 'ArrowDown', activeIndex: 0, count: 0 }))
      .toBeNull();
  });
});
