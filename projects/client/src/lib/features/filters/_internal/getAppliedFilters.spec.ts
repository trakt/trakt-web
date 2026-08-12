import { describe, expect, it } from 'vitest';
import { FilterKey } from '../models/Filter.ts';
import { getAppliedFilters } from './getAppliedFilters.ts';

describe('getAppliedFilters', () => {
  it('should return filters that carry a value', () => {
    const params = new URLSearchParams({ [FilterKey.Genres]: 'action' });

    expect(getAppliedFilters(params).map((filter) => filter.key)).toEqual([
      FilterKey.Genres,
    ]);
  });

  it('should ignore filters with an empty value', () => {
    const params = new URLSearchParams({ [FilterKey.Genres]: '' });

    expect(getAppliedFilters(params)).toEqual([]);
  });

  it('should ignore non-filter params', () => {
    const params = new URLSearchParams({ page: '2' });

    expect(getAppliedFilters(params)).toEqual([]);
  });
});
