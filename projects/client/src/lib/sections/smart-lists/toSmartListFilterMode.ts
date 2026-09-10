import { EXCLUSION_PREFIX } from '$lib/features/filters/_internal/exclusionPrefix.ts';
import { FILTERS } from '$lib/features/filters/_internal/constants.ts';
import { FilterMode } from '$lib/features/filters/models/FilterMode.ts';
import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';

const SIMPLE_KEYS: ReadonlyArray<string> = FILTERS.map((filter) => filter.key);

function isAdvancedValue(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  const entries = value.filter((entry) => typeof entry === 'string');

  return entries.length > 1 ||
    entries.some((entry) => entry.startsWith(EXCLUSION_PREFIX));
}

export function toSmartListFilterMode(filters: SmartListFilters): FilterMode {
  const isAdvanced = Object.entries(filters).some(([key, value]) =>
    !SIMPLE_KEYS.includes(key) || isAdvancedValue(value)
  );

  return isAdvanced ? FilterMode.Advanced : FilterMode.Simple;
}
