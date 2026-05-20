import type { ListFilter } from '$lib/features/filters/models/Filter.ts';

export type ListFilterProps = {
  value: string | Nil;
  display: string;
  filter: ListFilter;
};
