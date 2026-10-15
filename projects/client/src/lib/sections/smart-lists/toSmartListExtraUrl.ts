import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import { SMART_LIST_EXTRA_PARAM_TYPES } from './smartListExtraParamTypes.ts';
import { toSmartListFilterParams } from './toSmartListFilterParams.ts';

type SmartListExtraUrlProps = {
  url: URL;
  filters: SmartListFilters;
};

export function toSmartListExtraUrl(
  { url, filters }: SmartListExtraUrlProps,
): URL {
  const next = new URL(url);

  Object.keys(SMART_LIST_EXTRA_PARAM_TYPES).forEach((key) =>
    next.searchParams.delete(key)
  );

  Object.entries(toSmartListFilterParams(filters))
    .filter(([key]) => key in SMART_LIST_EXTRA_PARAM_TYPES)
    .forEach(([key, value]) => next.searchParams.set(key, value));

  return next;
}
