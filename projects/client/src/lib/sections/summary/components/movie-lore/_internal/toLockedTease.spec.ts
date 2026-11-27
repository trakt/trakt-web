import { describe, expect, it } from 'vitest';
import { toLockedTease } from './toLockedTease.ts';

describe('util: toLockedTease', () => {
  it('should name both parts', () => {
    expect(toLockedTease({ lore: 6, previously: 2 })).toBe(
      '6 things to know · 2 earlier films recapped',
    );
  });

  it('should use the singular for one of each', () => {
    expect(toLockedTease({ lore: 1, previously: 1 })).toBe(
      '1 thing to know · 1 earlier film recapped',
    );
  });

  it('should leave out an empty part', () => {
    expect(toLockedTease({ lore: 4, previously: 0 })).toBe('4 things to know');
    expect(toLockedTease({ lore: 0, previously: 1 })).toBe(
      '1 earlier film recapped',
    );
  });

  it('should be empty when there is nothing locked', () => {
    expect(toLockedTease({ lore: 0, previously: 0 })).toBe('');
  });
});
