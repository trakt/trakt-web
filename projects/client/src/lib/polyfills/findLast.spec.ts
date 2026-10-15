import { afterAll, describe, expect, it, vi } from 'vitest';
import './findLast.ts';

const native = vi.hoisted(() => {
  const findLast = Array.prototype.findLast;
  Reflect.deleteProperty(Array.prototype, 'findLast');
  return findLast;
});

describe('Array.prototype.findLast polyfill', () => {
  afterAll(() => {
    // skipcq: JS-0061
    Object.defineProperty(Array.prototype, 'findLast', {
      value: native,
      writable: true,
      configurable: true,
    });
  });

  it('should install itself when the native method is missing', () => {
    expect(Array.prototype.findLast).not.toBe(native);
  });

  it('should return the last matching element', () => {
    expect([1, 2, 3, 4].findLast((value) => value % 2 === 1)).toBe(3);
  });

  it('should return undefined when nothing matches', () => {
    expect([1, 2, 3].findLast((value) => value > 3)).toBeUndefined();
  });

  it('should pass the index to the predicate', () => {
    expect(['a', 'b', 'c'].findLast((_, index) => index === 0)).toBe('a');
  });
});
