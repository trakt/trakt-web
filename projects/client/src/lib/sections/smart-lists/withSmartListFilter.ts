import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

type FilterKey = keyof SmartListFilters;

type WithSmartListFilterProps<K extends FilterKey> = {
  filters: SmartListFilters;
  key: K;
  value: SmartListFilters[K] | null;
};

const isEmpty = (value: unknown) =>
  value == null ||
  value === false ||
  (Array.isArray(value) && value.length === 0);

export function withSmartListFilter<K extends FilterKey>({
  filters,
  key,
  value,
}: WithSmartListFilterProps<K>): SmartListFilters {
  const { [key]: _previous, ...rest } = filters;

  return isEmpty(value) ? rest : { ...rest, [key]: value };
}
