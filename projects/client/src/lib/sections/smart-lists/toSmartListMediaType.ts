import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';

const MEDIA_TYPES: Record<DiscoverMode, SmartListMediaType> = {
  movie: 'movies',
  show: 'shows',
  media: 'media',
};

export function toSmartListMediaType(mode: DiscoverMode): SmartListMediaType {
  return MEDIA_TYPES[mode];
}
