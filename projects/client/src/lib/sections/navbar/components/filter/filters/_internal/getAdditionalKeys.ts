import type { Filter } from '$lib/features/filters/models/Filter.ts';
import type { AdditionalKey } from '$lib/features/filters/models/FilterOptions.ts';

export const getAdditionalKeys = (
  filter: Filter,
): AdditionalKey[] => {
  if ('advanced' in filter && 'additionalKeys' in filter.advanced) {
    return filter.advanced.additionalKeys ?? [];
  }

  return [];
};
