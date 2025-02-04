import { describe, expect, it } from 'vitest';
import { assertDefined } from './assertDefined.ts';

describe('assertDefined', () => {
  it('should return the value if defined', () => {
    const value = 'test';
    expect(assertDefined(value)).toBe(value);
  });

  it('should throw error if value is null', () => {
    expect(() => assertDefined(null)).toThrow();
  });

  it('should throw error if value is undefined', () => {
    expect(() => assertDefined(undefined)).toThrow();
  });

  it('should throw error with custom message if provided', () => {
    const errorMessage = 'Custom error message';
    expect(() => assertDefined(undefined, errorMessage)).toThrow(errorMessage);
  });
});
