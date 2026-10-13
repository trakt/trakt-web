import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';

function toParamValue(value: unknown): string | undefined {
  if (
    typeof value === 'boolean' || typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return undefined;
    }

    return value.every((entry) => typeof entry === 'number')
      ? value.join('-')
      : value.join(',');
  }

  return undefined;
}

export function toSmartListFilterParams(
  filters: SmartListFilters,
): Record<string, string> {
  return Object.entries(filters).reduce<Record<string, string>>(
    (params, [key, value]) => {
      const param = toParamValue(value);

      return param ? { ...params, [key]: param } : params;
    },
    {},
  );
}
