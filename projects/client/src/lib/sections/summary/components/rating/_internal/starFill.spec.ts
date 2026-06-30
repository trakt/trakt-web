import { describe, expect, it } from 'vitest';
import { starFill } from './starFill.ts';

describe('util: starFill', () => {
  it('should fill stars at or below the value', () => {
    expect(starFill({ value: 3, index: 0, allowHalf: true })).toBe('full');
    expect(starFill({ value: 3, index: 2, allowHalf: true })).toBe('full');
  });

  it('should leave stars above the value empty', () => {
    expect(starFill({ value: 3, index: 3, allowHalf: true })).toBe('none');
    expect(starFill({ value: 0, index: 0, allowHalf: true })).toBe('none');
  });

  it('should half-fill the star straddled by a half value', () => {
    expect(starFill({ value: 2.5, index: 2, allowHalf: true })).toBe('half');
  });

  it('should never half-fill when allowHalf is false', () => {
    expect(starFill({ value: 2.5, index: 2, allowHalf: false })).toBe('none');
  });
});
