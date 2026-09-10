import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';

function toParamValue(value: unknown): string | undefined {
  if (typeof value === 'boolean') {
    return value ? 'true' : undefined;
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
