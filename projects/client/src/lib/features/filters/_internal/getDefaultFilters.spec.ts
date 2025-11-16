import { beforeEach, describe, expect, it } from 'vitest';
import { FilterKey } from '../models/Filter.ts';
import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';
import { getDefaultFilters } from './getDefaultFilters.ts';

describe('getDefaultFilters', () => {
  const filters: Array<[string, string]> = [
    [FilterKey.Genres, 'action'],
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the stored filters', () => {
    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify(filters));
    expect(getDefaultFilters()).toEqual(filters);
  });

  it('should return undefined if there is nothing stored', () => {
    expect(getDefaultFilters()).toBeUndefined();
  });
});
