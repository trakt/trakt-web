import type { ActivityEntry } from '$lib/sections/lists/stores/models/ActivityEntry.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { getActivityTime } from './getActivityTime.ts';

export function groupHistoryByDay<T>(items: ActivityEntry<T>[]) {
  return items.reduce((groups, item) => {
    const key = getDayKey(getActivityTime(item));
    const group = groups.get(key) ?? [];

    group.push(item);
    groups.set(key, group);

    return groups;
  }, new Map<string, ActivityEntry<T>[]>());
}
