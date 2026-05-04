import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';

export function getActivityTime<T>(entry: ActivityEntry<T>): Date {
  if ('watchedAt' in entry) {
    return entry.watchedAt;
  }

  return entry.activityAt;
}
