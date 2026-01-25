import type { ListFilter } from '$lib/features/filters/models/Filter.ts';

export type ListFilterProps = {
  color: 'blue' | 'default';
  value: string | Nil;
  display: string;
  filter: ListFilter;
  multiselect?: boolean;
};
