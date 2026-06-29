import { goto } from '$app/navigation';
import { page } from '$app/state';
import { persistDebounced } from '$lib/utils/storage/persistDebounced.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { AnalyticsEvent } from '../analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../analytics/useTrack.ts';
import type { ParameterType } from '../parameters/_internal/createParameterContext.ts';
import { useParameters } from '../parameters/useParameters.ts';
import { DISCOVER_MODE_PARAM, FILTERS } from './_internal/constants.ts';
import { getDefaultFilters } from './_internal/getDefaultFilters.ts';
import { hasFilter } from './_internal/hasFilter.ts';
import { processFilterParams } from './_internal/processFilterParams.ts';
import type { DiscoverMode } from './models/DiscoverMode.ts';
import { FilterMode } from './models/FilterMode.ts';

export const STORED_FILTERS_KEY = 'trakt-global-filters' as const;
export const STORED_FILTERS_MODE_KEY = 'trakt-global-filters-mode' as const;

export type StoredFilter = Record<string, ParameterType>;

function mapToFilterMode(value: string | Nil): FilterMode {
  if (value === FilterMode.Simple) return FilterMode.Simple;
  if (value === FilterMode.Advanced) return FilterMode.Advanced;
  return FilterMode.Simple;
}

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
      persistDebounced(key, newFilters);
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

const activeModeSubject = new BehaviorSubject<FilterMode>(
  mapToFilterMode(safeLocalStorage.getItem(STORED_FILTERS_MODE_KEY)),
);

export function useStoredFilters() {
  const { search } = useParameters();
  const { track } = useTrack(AnalyticsEvent.Filters);

  const goToStoredFilters = (
    filters: StoredFilter,
    baseUrl: URL,
  ) => {
    const url = new URL(baseUrl);

    processFilterParams(
      Object.entries(filters),
      (key, value) => {
        url.searchParams.set(key, String(value));
      },
    );

    // No-op navigations (e.g. empty stored filters) would otherwise loop
    // forever under afterNavigate, since the URL never changes.
    if (url.href === page.url.href) {
      return;
    }

    goto(url, { replaceState: true, keepFocus: true, noScroll: true });
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

  const restoreFilters = (mode?: DiscoverMode) => {
    const url = new URL(page.url);

    if (mode) {
      url.searchParams.set(DISCOVER_MODE_PARAM, mode);
    }

    const hasParams = hasFilter(page.url.searchParams);
    const defaultFilters = getDefaultFilters();
    const shouldRestoreFilters = !hasParams && defaultFilters;

    if (mode && !shouldRestoreFilters) {
      if (url.href !== page.url.href) {
        goto(url, { replaceState: true, keepFocus: true, noScroll: true });
      }
      return;
    }

    if (shouldRestoreFilters) {
      goToStoredFilters(defaultFilters, url);
    }
  };

  const resetFilters = () => {
    track({ action: 'reset' });

    const defaultFilters = getDefaultFilters();
    if (!defaultFilters) {
      goto(page.url.pathname, { replaceState: true });
      return;
    }

    const url = new URL(page.url);
    FILTERS.forEach((filter) => url.searchParams.delete(filter.key));
    goToStoredFilters(defaultFilters, url);
  };

  const setActiveMode = (mode: string) => {
    const mapped = mapToFilterMode(mode);
    safeLocalStorage.setItem(STORED_FILTERS_MODE_KEY, mapped);
    activeModeSubject.next(mapped);
  };

  return {
    saveFilters,
    restoreFilters,
    resetFilters,
    storedFilters: storedFiltersStore.filters,
    activeMode: activeModeSubject.asObservable(),
    setActiveMode,
  };
}
