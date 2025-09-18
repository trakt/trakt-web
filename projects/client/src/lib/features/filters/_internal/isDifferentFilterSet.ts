import type { FilterKey } from '../models/Filter.ts';
import type { StoredFilter } from '../useStoredFilters.ts';
import { FILTERS } from './constants.ts';

export function isDifferentFilterSet(
  filters: StoredFilter,
  searchParams: URLSearchParams,
) {
  const filterKeys = FILTERS.map((filter) => filter.key);
  const filterParams = Array.from(searchParams.entries())
    .filter(([key]) => filterKeys.includes(key as FilterKey));

  const currentFilters = Object.fromEntries(filterParams);

  return (
    Object.keys(filters).length !== filterParams.length ||
    Object.entries(filters).some(([key, value]) =>
      currentFilters[key] !== value
    )
  );
}
