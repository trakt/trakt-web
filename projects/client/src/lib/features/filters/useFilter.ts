import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { derived, readable } from 'svelte/store';
import { useUser } from '../auth/stores/useUser.ts';
import { FILTERS } from './_internal/constants.ts';
import { mapToSearchParamValue } from './_internal/mapToSearchParamValue.ts';

export function useFilter() {
  const { search } = useParameters();
  const { user } = useUser();

  return {
    filters: readable(FILTERS),
    getFilterValue: (key: FilterKey) => {
      const filter = assertDefined(
        FILTERS.find((filter) => filter.key === key),
      );
      return derived(search, ($search) => {
        const defaultValue = filter.type === 'toggle'
          ? filter.defaultValue
          : undefined;
        return $search.get(key) ?? defaultValue;
      });
    },
    hasActiveFilter: derived(search, ($search) => {
      return FILTERS.some((filter) => Boolean($search.get(filter.key)));
    }),
    filterMap: derived([search, user], ([$search, $user]) => {
      return FILTERS
        .filter((filter) => {
          const hasParameter = Boolean($search.get(filter.key));
          const isToggle = filter.type === 'toggle';

          return hasParameter || isToggle;
        })
        .reduce((filterMap, filter) => {
          filterMap[filter.key] = mapToSearchParamValue({
            filter,
            value: $search.get(filter.key),
            user: $user,
          });
          return filterMap;
        }, {} as Record<string, string>);
    }),
  };
}
