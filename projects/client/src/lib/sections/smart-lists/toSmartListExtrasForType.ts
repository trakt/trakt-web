import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import { SHOW_ONLY_SMART_LIST_FILTERS } from './showOnlySmartListFilters.ts';

type SmartListExtrasForTypeProps = {
  filters: SmartListFilters;
  type: DiscoverMode;
};

export function toSmartListExtrasForType(
  { filters, type }: SmartListExtrasForTypeProps,
): SmartListFilters {
  if (type !== 'movie') return filters;

  return Object.fromEntries(
    Object.entries(filters).filter(([key]) =>
      !SHOW_ONLY_SMART_LIST_FILTERS.includes(key as keyof SmartListFilters)
    ),
  );
}
