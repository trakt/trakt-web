import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListWriteRequest } from '@trakt/api';
import type { SmartListFilters } from '$lib/requests/models/SmartListFilters.ts';
import type { ListTarget } from '../models/ListTarget.ts';
import { toSmartListFilters } from '../toSmartListFilters.ts';
import { toSmartListMediaType } from '../toSmartListMediaType.ts';

type SmartListWriteProps = {
  name: string;
  type: DiscoverMode;
  target?: ListTarget;
  filterMap: Record<string, string>;
  baseFilters?: SmartListFilters;
  privacy?: SmartListWriteRequest['privacy'];
};

export function toSmartListWrite({
  name,
  type,
  target,
  filterMap,
  baseFilters,
  privacy,
}: SmartListWriteProps): SmartListWriteRequest {
  return {
    name: name.trim(),
    source: target as SmartListWriteRequest['source'],
    media_type: toSmartListMediaType(type),
    filters: toSmartListFilters(filterMap, baseFilters),
    ...(privacy ? { privacy } : {}),
  };
}
