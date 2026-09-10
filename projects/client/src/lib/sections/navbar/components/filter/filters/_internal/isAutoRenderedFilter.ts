import type { Filter } from '$lib/features/filters/models/Filter.ts';

export const isAutoRenderedFilter = (filter: Filter): boolean => {
  return !filter.advancedOnly;
};
