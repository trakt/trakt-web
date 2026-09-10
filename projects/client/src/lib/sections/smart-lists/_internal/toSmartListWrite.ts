import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListWriteRequest } from '@trakt/api';
import type { SmartListFilters } from '$lib/requests/queries/users/smartListQuery.ts';
import type { ListTarget } from '../models/ListTarget.ts';
import { toSmartListFilters } from '../toSmartListFilters.ts';

const MEDIA_TYPES: Record<DiscoverMode, SmartListWriteRequest['media_type']> = {
  movie: 'movies',
  show: 'shows',
  media: 'media',
};

type SmartListWriteProps = {
  name: string;
  type: DiscoverMode;
  target?: ListTarget;
  filterMap: Record<string, string>;
  baseFilters?: SmartListFilters;
};

export function toSmartListWrite(
  { name, type, target, filterMap, baseFilters }: SmartListWriteProps,
): SmartListWriteRequest {
  return {
    name,
    source: target as SmartListWriteRequest['source'],
    media_type: MEDIA_TYPES[type],
    filters: toSmartListFilters(filterMap, baseFilters),
  };
}
