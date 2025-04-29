import type { FilterParams } from '$lib/requests/models/FilterParams.ts';

export function getGlobalFilterDependencies(params: FilterParams) {
  return [
    params.filter?.genres,
    params.filter?.ignore_watched,
    params.filter?.ignore_watchlisted,
  ];
}
