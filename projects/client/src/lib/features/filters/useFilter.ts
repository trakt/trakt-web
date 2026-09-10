import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { getAdditionalKeys } from '../../sections/navbar/components/filter/filters/_internal/getAdditionalKeys.ts';
import { useNavbarState } from '../../sections/navbar/useNavbarState.ts';
import { useUser } from '../auth/stores/useUser.ts';
import { FILTERS } from './_internal/constants.ts';
import { getAppliedFilters } from './_internal/getAppliedFilters.ts';
import { isDifferentFilterSet } from './_internal/isDifferentFilterSet.ts';
import { mapToSearchParamValue } from './_internal/mapToSearchParamValue.ts';
import { parentalGuideFilters } from './parentalGuideFilters.ts';
import { useStoredFilters } from './useStoredFilters.ts';

export function useFilter() {
  const { search: rawSearch } = useParameters();
  const { user } = useUser();
  const { storedFilters: rawStoredFilters } = useStoredFilters();
  const { state } = useNavbarState();

  const { isAuthorized } = useAuth();
  const { isEnabled } = useFeatureFlag();
  const parentalKeys = new Set<string>(
    parentalGuideFilters.map(({ key }) => key),
  );
  const canUseParentalFilters = combineLatest([
    isEnabled(FeatureFlag.ParentalGuide),
    isAuthorized,
    user,
  ]).pipe(
    map(([enabled, authorized, currentUser]) =>
      enabled && authorized && Boolean(currentUser?.isVip)
    ),
    distinctUntilChanged(),
  );
  const search = combineLatest([rawSearch, canUseParentalFilters]).pipe(
    map(([params, available]) =>
      available ? params : new URLSearchParams(
        Array.from(params).filter(([key]) => !parentalKeys.has(key)),
      )
    ),
  );
  const storedFilters = combineLatest([rawStoredFilters, canUseParentalFilters])
    .pipe(
      map(([filters, available]) =>
        available ? filters : Object.fromEntries(
          Object.entries(filters ?? {}).filter(([key]) =>
            !parentalKeys.has(key)
          ),
        )
      ),
    );

  return {
    filters: FILTERS,
    getFilterValue: (key: FilterKey) => {
      return search.pipe(
        map(($search) => {
          return $search.get(key);
        }),
      );
    },
    activeFilterCount: combineLatest(
      [search, storedFilters, state],
    ).pipe(
      map(([$search, $storedFilters, $state]) => {
        if (!$state.hasFilters) return 0;

        const defaults = $storedFilters ?? {};
        return FILTERS.filter((filter) => {
          const current = $search.get(filter.key) ?? null;
          const stored = (defaults[filter.key] as string | undefined) ?? null;
          return current !== stored;
        }).length;
      }),
    ),
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
    isFiltered: combineLatest(
      [search, state],
    ).pipe(
      map(([$search, $state]) => {
        if (!$state.hasFilters) {
          return false;
        }

        return getAppliedFilters($search).length > 0;
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

        return getAppliedFilters($search)
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
      /*
        combineLatest includes `user`, which can refresh after any action
        that can update history/ratings/etc. Without distinctUntilChanged,
        a new object reference would propagate to consumers and cause
        list stores to recreate with empty previous state.
       */
      distinctUntilChanged((a, b) => {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        return aKeys.length === bKeys.length &&
          aKeys.every((k) => a[k] === b[k]);
      }),
    ),
  };
}
