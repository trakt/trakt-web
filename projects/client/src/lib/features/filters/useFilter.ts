import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, readable } from 'svelte/store';
import { FILTERS } from './constants.ts';

export function useFilter() {
  const { search } = useParameters();

  return {
    filters: readable(FILTERS),
    getFilterValue: (key: FilterKey) => {
      return derived(search, ($search) => {
        return $search.get(key);
      });
    },
    hasActiveFilter: derived(search, ($search) => {
      return FILTERS.some((filter) => Boolean($search.get(filter.key)));
    }),
    filterMap: derived(search, ($search) => {
      return FILTERS
        .filter((filter) => {
          const hasParameter = Boolean($search.get(filter.key));
          return hasParameter;
        })
        .reduce((filterMap, filter) => {
          const parameterValue = assertDefined($search.get(filter.key));

          filterMap[filter.key] = parameterValue;
          return filterMap;
        }, {} as Record<string, string>);
    }),
  };
}
