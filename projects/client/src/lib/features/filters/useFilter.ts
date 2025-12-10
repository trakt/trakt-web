import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { combineLatest, map, of } from 'rxjs';
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

  const state$ = toObservable(state);

  return {
    filters: of(FILTERS),
    getFilterValue: (key: FilterKey) => {
      const filter = assertDefined(
        FILTERS.find((filter) => filter.key === key),
      );
      return search.pipe(map((s) => {
        const defaultValue = filter.type === 'toggle'
          ? filter.defaultValue
          : undefined;
        return s.get(key) ?? defaultValue;
      }));
    },
    hasActiveFilter: combineLatest([search, storedFilters, state$]).pipe(
      map(([currentSearch, currentStoredFilters, currentState]) => {
        if (!currentState.hasFilters) {
          return false;
        }

        const defaultFilters = currentStoredFilters ?? {};
        return isDifferentFilterSet(defaultFilters, currentSearch);
      }),
    ),
    filterMap: combineLatest([search, user, state$]).pipe(
      map(([currentSearch, currentUser, currentState]) => {
        if (!currentState.hasFilters) {
          return {};
        }

        return FILTERS
          .filter((filter) => {
            const hasParameter = Boolean(currentSearch.get(filter.key));
            const isToggle = filter.type === 'toggle';

            return hasParameter || isToggle;
          })
          .reduce((filterMap, filter) => {
            filterMap[filter.key] = mapToSearchParamValue({
              filter,
              value: currentSearch.get(filter.key),
              user: currentUser,
            });
            return filterMap;
          }, {} as Record<string, string>);
      }),
    ),
  };
}
