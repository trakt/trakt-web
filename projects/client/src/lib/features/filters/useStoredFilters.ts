import { browser } from '$app/environment';
import { page } from '$app/state';
import { get } from 'svelte/store';
import { NOOP_FN } from '../../utils/constants.ts';
import type { ParameterType } from '../parameters/_internal/createParameterContext.ts';
import { useParameters } from '../parameters/useParameters.ts';
import { getDefaultFilters } from './_internal/getDefaultFilters.ts';
import { hasFilter } from './_internal/hasFilter.ts';
import { processFilterParams } from './_internal/processFilterParams.ts';

export const STORED_FILTERS_KEY = 'trakt-global-filters' as const;

export function useStoredFilters() {
  if (!browser) {
    return {
      saveFilters: NOOP_FN,
      restoreFilters: NOOP_FN,
    };
  }

  const { search } = useParameters();

  const saveFilters = () => {
    const searchParams = get(search);
    const filtersObject: Record<string, ParameterType> = {};

    processFilterParams(
      searchParams.entries(),
      (key, value) => {
        filtersObject[key] = value;
      },
    );

    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify(filtersObject));
  };

  const restoreFilters = () => {
    const hasParams = hasFilter(page.url.searchParams);
    const defaultFilters = getDefaultFilters();

    if (hasParams || !defaultFilters) {
      return;
    }

    processFilterParams(
      Object.entries(defaultFilters),
      (key, value) => {
        page.url.searchParams.set(key, String(value));
      },
    );

    globalThis.window.history.replaceState({}, '', page.url);
  };

  return {
    saveFilters,
    restoreFilters,
  };
}
