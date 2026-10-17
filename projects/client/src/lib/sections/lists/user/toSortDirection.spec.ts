import { describe, expect, it } from 'vitest';
import { toSortDirection } from './toSortDirection.ts';

describe('util: toSortDirection', () => {
  it('should keep asc and desc', () => {
    expect(toSortDirection('asc')).toBe('asc');
    expect(toSortDirection('desc')).toBe('desc');
  });

  it('should drop any other value', () => {
    expect(toSortDirection('ASC')).toBeUndefined();
    expect(toSortDirection('')).toBeUndefined();
    expect(toSortDirection(null)).toBeUndefined();
    expect(toSortDirection(undefined)).toBeUndefined();
  });
});
