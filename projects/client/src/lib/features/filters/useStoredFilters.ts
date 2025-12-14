import { goto } from '$app/navigation';
import { page } from '$app/state';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import type { ParameterType } from '../parameters/_internal/createParameterContext.ts';
import { useParameters } from '../parameters/useParameters.ts';
import { FILTERS } from './_internal/constants.ts';
import { getDefaultFilters } from './_internal/getDefaultFilters.ts';
import { hasFilter } from './_internal/hasFilter.ts';
import { processFilterParams } from './_internal/processFilterParams.ts';

export const STORED_FILTERS_KEY = 'trakt-global-filters' as const;

export type StoredFilter = Record<string, ParameterType>;

export function createStoredFiltersStore(
  key: string,
  initialFilters: StoredFilter,
) {
  const filters = new BehaviorSubject<StoredFilter>(
    JSON.parse(safeLocalStorage.getItem(key) ?? JSON.stringify(initialFilters)),
  );

  return {
    filters: filters.asObservable(),
    update: (newFilters: StoredFilter) => {
      safeLocalStorage.setItem(key, JSON.stringify(newFilters));
      filters.next(newFilters);
    },
    reset: () => {
      safeLocalStorage.removeItem(key);
      filters.next(initialFilters);
    },
  };
}

const storedFiltersStore = createStoredFiltersStore(
  STORED_FILTERS_KEY,
  getDefaultFilters() || {},
);

export function useStoredFilters() {
  const { search } = useParameters();
  const { track } = useTrack(AnalyticsEvent.Filters);

  const goToStoredFilters = (filters: StoredFilter) => {
    processFilterParams(
      Object.entries(filters),
      (key, value) => {
        page.url.searchParams.set(key, String(value));
      },
    );

    goto(page.url, { replaceState: true });
  };

  const saveFilters = () => {
    track({ action: 'save' });

    let currentSearchParams: URLSearchParams | undefined;
    const sub = search.subscribe((p) => {
      currentSearchParams = p;
    });
    sub.unsubscribe();

    if (!currentSearchParams) return;

    const filtersObject: StoredFilter = {};

    processFilterParams(
      currentSearchParams.entries(),
      (key, value) => {
        filtersObject[key] = value;
      },
    );

    storedFiltersStore.update(filtersObject);
  };

  const restoreFilters = () => {
    const hasParams = hasFilter(page.url.searchParams);
    const defaultFilters = getDefaultFilters();

    if (hasParams || !defaultFilters) {
      return;
    }

    goToStoredFilters(defaultFilters);
  };

  const resetFilters = () => {
    track({ action: 'reset' });

    const defaultFilters = getDefaultFilters();
    if (!defaultFilters) {
      goto(page.url.pathname, { replaceState: true });
      return;
    }

    FILTERS.forEach((filter) => page.url.searchParams.delete(filter.key));
    goToStoredFilters(defaultFilters);
  };

  return {
    saveFilters,
    restoreFilters,
    resetFilters,
    storedFilters: storedFiltersStore.filters,
  };
}
