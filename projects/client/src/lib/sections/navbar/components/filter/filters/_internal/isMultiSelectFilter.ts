import type {
  AdvancedMultiSelectFilter,
  Filter,
} from '$lib/features/filters/models/Filter.ts';

export const isMultiSelectFilter = (
  filter: Filter,
): filter is AdvancedMultiSelectFilter => {
  return 'advanced' in filter && filter.advanced.type === 'multi-select';
};
