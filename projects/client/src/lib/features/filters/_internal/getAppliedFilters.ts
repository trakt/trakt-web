import { FILTERS } from './constants.ts';

type AppliedFilter = typeof FILTERS[number];

export function getAppliedFilters(
  params: URLSearchParams,
): ReadonlyArray<AppliedFilter> {
  return FILTERS.filter((filter) => Boolean(params.get(filter.key)));
}
