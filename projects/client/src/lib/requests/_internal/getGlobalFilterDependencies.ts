import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';

export function getGlobalFilterDependencies(params: FilterParams) {
  const filterKeys = Object.values(FilterKey);

  return filterKeys
    .filter((key) => key in (params.filter || {}))
    .map((key) => params.filter?.[key as keyof typeof params.filter]);
}
