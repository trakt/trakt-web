import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

const toComparable = (filters: SmartListFilters) =>
  JSON.stringify(
    Object.entries(filters).sort(([a], [b]) => a.localeCompare(b)),
  );

export function isSameSmartListFilters(
  a: SmartListFilters,
  b: SmartListFilters,
): boolean {
  return toComparable(a) === toComparable(b);
}
