import { goto } from '$app/navigation';
import { page } from '$app/state';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { derived, get, writable } from 'svelte/store';
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

const storedFilters = writable<StoredFilter | null>(getDefaultFilters());

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

    const searchParams = get(search);
    const filtersObject: StoredFilter = {};

    processFilterParams(
      searchParams.entries(),
      (key, value) => {
        filtersObject[key] = value;
      },
    );

    storedFilters.set(filtersObject);
    safeLocalStorage.setItem(STORED_FILTERS_KEY, JSON.stringify(filtersObject));
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
    storedFilters: derived(storedFilters, ($storedFilters) => $storedFilters),
  };
}
