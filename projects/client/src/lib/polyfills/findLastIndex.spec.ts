import { afterAll, describe, expect, it, vi } from 'vitest';
import './findLastIndex.ts';

const native = vi.hoisted(() => {
  const findLastIndex = Array.prototype.findLastIndex;
  Reflect.deleteProperty(Array.prototype, 'findLastIndex');
  return findLastIndex;
});

describe('Array.prototype.findLastIndex polyfill', () => {
  afterAll(() => {
    // skipcq: JS-0061
    Object.defineProperty(Array.prototype, 'findLastIndex', {
      value: native,
      writable: true,
      configurable: true,
    });
  });

  it('should install itself when the native method is missing', () => {
    expect(Array.prototype.findLastIndex).not.toBe(native);
  });

  it('should return the index of the last matching element', () => {
    expect([1, 2, 3, 4].findLastIndex((value) => value % 2 === 1)).toBe(2);
  });

  it('should return -1 when nothing matches', () => {
    expect([1, 2, 3].findLastIndex((value) => value > 3)).toBe(-1);
  });

  it('should pass the index to the predicate', () => {
    expect(['a', 'b', 'c'].findLastIndex((_, index) => index < 2)).toBe(1);
  });
});
