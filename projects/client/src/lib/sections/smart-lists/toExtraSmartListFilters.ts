import { FILTER_KEYS } from '$lib/features/filters/filterKeys.ts';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

const isPanelKey = (key: string) =>
  (FILTER_KEYS as readonly string[]).includes(key);

export function toExtraSmartListFilters(
  filters: SmartListFilters,
): SmartListFilters {
  return Object.entries(filters).reduce<SmartListFilters>(
    (extras, [key, value]) =>
      isPanelKey(key) ? extras : { ...extras, [key]: value },
    {},
  );
}
