import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { describe, expect, it } from 'vitest';
import type { StoredFilter } from '../useStoredFilters.ts';
import { FILTERS } from './constants.ts';
import { isDifferentFilterSet } from './isDifferentFilterSet.ts';

function createSearchParams(obj: Record<string, string>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    params.set(key, value);
  });
  return params;
}

describe('isDifferentFilterSet', () => {
  const filterKeys = FILTERS.map((f) => f.key).filter(Boolean);
  const baseFilters: StoredFilter = {};
  filterKeys.forEach((key, i) => {
    baseFilters[key] = `value${i}`;
  });

  it('returns false when filters and searchParams match', () => {
    const params = createSearchParams(
      Object.fromEntries(
        Object.entries(baseFilters).map(([k, v]) => [k, String(v)]),
      ),
    );

    expect(isDifferentFilterSet(baseFilters, params)).toBe(false);
  });

  it('returns true when filters have different values', () => {
    const changed = { ...baseFilters };
    const firstKey = assertDefined(filterKeys.at(0));
    changed[firstKey] = 'otherValue';

    const params = createSearchParams(
      Object.fromEntries(
        Object.entries(changed).map(([k, v]) => [k, String(v)]),
      ),
    );

    expect(isDifferentFilterSet(baseFilters, params)).toBe(true);
  });

  it('returns true when filters have different length', () => {
    const firstKey = assertDefined(filterKeys.at(0));
    const lessFilters = { [firstKey]: 'any_value' };

    const params = createSearchParams(
      Object.fromEntries(
        Object.entries(lessFilters).map(([k, v]) => [k, String(v)]),
      ),
    );

    expect(isDifferentFilterSet(baseFilters, params)).toBe(true);
  });

  it('ignores non-filter params in searchParams', () => {
    const params = createSearchParams({
      ...Object.fromEntries(
        Object.entries(baseFilters).map(([k, v]) => [k, String(v)]),
      ),
      notAFilter: 'x',
    });

    expect(isDifferentFilterSet(baseFilters, params)).toBe(false);
  });

  it('returns true if searchParams missing a filter key', () => {
    const paramObj = Object.fromEntries(
      Object.entries(baseFilters).map(([k, v]) => [k, String(v)]),
    );
    const params = createSearchParams(paramObj);
    const firstKey = assertDefined(filterKeys.at(0));
    params.delete(firstKey);

    expect(isDifferentFilterSet(baseFilters, params)).toBe(true);
  });
});
