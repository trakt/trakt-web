import { describe, expect, it } from 'vitest';
import { FilterKey } from '../models/Filter.ts';
import { hasFilter } from './hasFilter.ts';

describe('hasFilter', () => {
  it('should report a filter when a filter param is present', () => {
    const params = new URLSearchParams({ [FilterKey.Genres]: 'action' });

    expect(hasFilter(params)).toBe(true);
  });

  it('should not report a filter for non-filter params', () => {
    const params = new URLSearchParams({ page: '2', sort_by: 'rank' });

    expect(hasFilter(params)).toBe(false);
  });

  it('should not report a filter for empty params', () => {
    expect(hasFilter(new URLSearchParams())).toBe(false);
  });

  it('should accept entry tuples', () => {
    expect(hasFilter([[FilterKey.Streaming, 'netflix']])).toBe(true);
    expect(hasFilter([['page', '2']])).toBe(false);
  });
});
