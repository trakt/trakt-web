import { describe, expect, it } from 'vitest';
import { findDefined } from './findDefined';

describe('findDefined', () => {
  it('should return first non-empty string', () => {
    expect(findDefined('', ' ', 'test', 'other')).toBe('test');
  });

  it('should return undefined if no non-empty strings found', () => {
    expect(findDefined('', ' ', '', undefined, null)).toBeUndefined();
  });

  it('should handle single value', () => {
    expect(findDefined('test')).toBe('test');
  });

  it('should handle whitespace strings', () => {
    expect(findDefined('   ', '\t', '\n')).toBeUndefined();
  });

  it('should handle null and undefined values', () => {
    expect(findDefined(null, undefined, 'test')).toBe('test');
  });

  it('should return first trimmed non-empty string', () => {
    expect(findDefined('  ', '  test  ', 'other')).toBe('  test  ');
  });
});
