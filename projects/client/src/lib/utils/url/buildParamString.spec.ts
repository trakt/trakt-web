import { describe, expect, it } from 'vitest';
import { buildParamString } from './buildParamString';

describe('buildParamString', () => {
  it('should build a query string from params object', () => {
    const params = {
      page: 1,
      limit: 10,
      search: 'test',
    };

    expect(buildParamString(params)).toBe('?page=1&limit=10&search=test');
  });

  it('should handle empty params object', () => {
    expect(buildParamString({})).toBe('');
  });

  it('should filter out undefined and null values', () => {
    const params = {
      page: 1,
      limit: undefined,
      search: null,
      sort: 'asc',
    };

    expect(buildParamString(params)).toBe('?page=1&sort=asc');
  });

  it('should convert numbers to strings', () => {
    const params = {
      count: 42,
      ratio: 3.14,
    };

    expect(buildParamString(params)).toBe('?count=42&ratio=3.14');
  });

  it('should return empty string if all values are undefined or null', () => {
    const params = {
      page: undefined,
      limit: null,
      search: undefined,
    };

    expect(buildParamString(params)).toBe('');
  });
});
