import type {
  AdvancedSliderFilter,
  Filter,
} from '$lib/features/filters/models/Filter.ts';

export const isSliderFilter = (
  filter: Filter,
): filter is AdvancedSliderFilter => {
  return 'advanced' in filter && filter.advanced.type === 'slider';
};
