import { describe, expect, it } from 'vitest';
import { isShallowEqual } from './isShallowEqual.ts';

describe('isShallowEqual', () => {
  it('should return true for two empty objects', () => {
    expect(isShallowEqual({}, {})).toBe(true);
  });

  it('should return true when all keys and primitive values match', () => {
    expect(isShallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
  });

  it('should return false when a value differs', () => {
    expect(isShallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('should return false when key counts differ', () => {
    expect(isShallowEqual({ a: 1 }, { a: 1, b: 2 } as { a: number; b?: number }))
      .toBe(false);
  });

  it('should treat nested objects by reference identity', () => {
    const nested = { x: 1 };
    expect(isShallowEqual({ n: nested }, { n: nested })).toBe(true);
    expect(isShallowEqual({ n: { x: 1 } }, { n: { x: 1 } })).toBe(false);
  });

  it('should compare functions and symbols by reference', () => {
    const fn = () => {};
    const sym = Symbol('s');
    expect(isShallowEqual({ fn, sym }, { fn, sym })).toBe(true);
    expect(isShallowEqual({ fn: () => {} }, { fn: () => {} })).toBe(false);
  });
});
