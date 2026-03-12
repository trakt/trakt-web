import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { combineLatest, map } from 'rxjs';
import { getAdditionalKeys } from '../../sections/navbar/components/filter/filters/_internal/getAdditionalKeys.ts';
import { useNavbarState } from '../../sections/navbar/useNavbarState.ts';
import { useUser } from '../auth/stores/useUser.ts';
import { FILTERS } from './_internal/constants.ts';
import { isDifferentFilterSet } from './_internal/isDifferentFilterSet.ts';
import { mapToSearchParamValue } from './_internal/mapToSearchParamValue.ts';
import { useStoredFilters } from './useStoredFilters.ts';

export function useFilter() {
  const { search } = useParameters();
  const { user } = useUser();
  const { storedFilters } = useStoredFilters();
  const { state } = useNavbarState();

  return {
    filters: FILTERS,
    getFilterValue: (key: FilterKey) => {
      return search.pipe(
        map(($search) => {
          return $search.get(key);
        }),
      );
    },
    hasActiveFilter: combineLatest(
      [search, storedFilters, state],
    ).pipe(
      map(([$search, $storedFilters, $state]) => {
        if (!$state.hasFilters) {
          return false;
        }

        const defaultFilters = $storedFilters ?? {};
        return isDifferentFilterSet(defaultFilters, $search);
      }),
    ),
    hasAnyAdvancedFilter: combineLatest(
      [search, state],
    ).pipe(
      map(([$search, $state]) => {
        if (!$state.hasFilters) {
          return false;
        }

        return FILTERS
          .filter((filter) => 'advanced' in filter)
          .some((filter) => $search.has(filter.key));
      }),
    ),
    filterMap: combineLatest(
      [search, user, state],
    ).pipe(
      map(([$search, $user, $state]) => {
        if (!$state.hasFilters) {
          return {};
        }

        return FILTERS
          .filter((filter) => Boolean($search.get(filter.key)))
          .reduce((filterMap, filter) => {
            filterMap[filter.key] = mapToSearchParamValue({
              filter,
              value: $search.get(filter.key),
              user: $user,
            });

            getAdditionalKeys(filter).forEach(({ key }) => {
              const value = $search.get(key);
              if (!value) return;
              filterMap[key] = value;
            });

            return filterMap;
          }, {} as Record<string, string>);
      }),
    ),
  };
}
