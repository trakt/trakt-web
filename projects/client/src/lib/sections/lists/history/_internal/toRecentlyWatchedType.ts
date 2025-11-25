import type { DiscoverMode } from '$lib/features/discover/models/DiscoverMode.ts';
import type { RecentlyWatchedType } from '../../stores/useRecentlyWatchedList.ts';

export function toRecentlyWatchedType(
  mode?: DiscoverMode,
): RecentlyWatchedType {
  if (!mode || mode === 'media') {
    return 'all';
  }

  return mode === 'movie' ? 'movie' : 'episode';
}
