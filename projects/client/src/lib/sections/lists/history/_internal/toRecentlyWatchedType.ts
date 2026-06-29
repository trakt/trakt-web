import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { RecentlyWatchedType } from '../../stores/useRecentlyWatchedList.ts';

export function toRecentlyWatchedType(
  mode?: DiscoverMode,
): RecentlyWatchedType {
  if (!mode || mode === 'media') {
    return 'media';
  }

  return mode === 'movie' ? 'movie' : 'episode';
}
