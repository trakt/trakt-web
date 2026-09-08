import { describe, expect, it } from 'vitest';
import './hasOwn.ts';

describe('Object.hasOwn polyfill', () => {
  it('reports own properties', () => {
    expect(Object.hasOwn({ a: 1 }, 'a')).toBe(true);
  });

  it('ignores inherited properties', () => {
    expect(Object.hasOwn({}, 'toString')).toBe(false);
  });

  it('reports own properties holding undefined', () => {
    expect(Object.hasOwn({ a: undefined }, 'a')).toBe(true);
  });

  it('reports array indices', () => {
    expect(Object.hasOwn(['a'], 0)).toBe(true);
    expect(Object.hasOwn(['a'], 1)).toBe(false);
  });
});
