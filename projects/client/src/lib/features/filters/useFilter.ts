import { page } from '$app/state';
import type { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { derived, readable } from 'svelte/store';
import { useUser } from '../auth/stores/useUser.ts';
import { FILTERS } from './_internal/constants.ts';
import { isDifferentFilterSet } from './_internal/isDifferentFilterSet.ts';
import { mapToSearchParamValue } from './_internal/mapToSearchParamValue.ts';
import { useStoredFilters } from './useStoredFilters.ts';

const UNSUPPORTED_ROUTES = [
  UrlBuilder.profile.me(),
  UrlBuilder.home(),
  UrlBuilder.search(),
] as const;

export function useFilter() {
  const { search } = useParameters();
  const { user } = useUser();
  const { storedFilters } = useStoredFilters();

  const hasFilterSupport = (route: string) =>
    !UNSUPPORTED_ROUTES.includes(route);

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
    hasActiveFilter: derived(
      [search, storedFilters],
      ([$search, $storedFilters]) => {
        if (UNSUPPORTED_ROUTES.includes(page.route.id ?? '')) {
          return false;
        }

        const defaultFilters = $storedFilters ?? {};
        return isDifferentFilterSet(defaultFilters, $search);
      },
    ),
    filterMap: derived([search, user], ([$search, $user]) => {
      if (!hasFilterSupport(page.route.id ?? '')) {
        return {};
      }

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
    hasFilterSupport,
  };
}
