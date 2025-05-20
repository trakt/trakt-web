import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';

export function getDefaultFilters() {
  const savedFilters = localStorage.getItem(STORED_FILTERS_KEY);
  if (savedFilters) {
    return JSON.parse(savedFilters);
  }
}
