import { describe, expect, it } from 'vitest';
import './toReversed.ts';

describe('Array.prototype.toReversed polyfill', () => {
  it('returns a reversed copy without mutating the source', () => {
    const source = [1, 2, 3];
    const reversed = source.toReversed();

    expect(reversed).toEqual([3, 2, 1]);
    expect(source).toEqual([1, 2, 3]);
  });
});
