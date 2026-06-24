import { beforeEach, describe, expect, it } from 'vitest';
import { FilterKey } from '../models/Filter.ts';
import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';
import { getSnapshotFilters } from './getSnapshotFilters.ts';

describe('util: getSnapshotFilters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should capture filter params present in the URL', () => {
    const params = new URLSearchParams({
      [FilterKey.Genres]: 'action',
      [FilterKey.Decade]: '2020',
      page: '2',
    });

    expect(getSnapshotFilters(params)).toEqual({
      [FilterKey.Genres]: 'action',
      [FilterKey.Decade]: '2020',
    });
  });

  it('should ignore non-filter params', () => {
    const params = new URLSearchParams({ page: '2', sort_by: 'rank' });
    expect(getSnapshotFilters(params)).toEqual({});
  });

  it('should fall back to the stored global filters when the URL has none', () => {
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.Genres]: 'comedy' }),
    );

    expect(getSnapshotFilters(new URLSearchParams())).toEqual({
      [FilterKey.Genres]: 'comedy',
    });
  });

  it('should stringify non-string stored filter values', () => {
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.IgnoreWatched]: true }),
    );

    expect(getSnapshotFilters(new URLSearchParams())).toEqual({
      [FilterKey.IgnoreWatched]: 'true',
    });
  });

  it('should return an empty object when there are no URL or stored filters', () => {
    expect(getSnapshotFilters(new URLSearchParams())).toEqual({});
  });
});
