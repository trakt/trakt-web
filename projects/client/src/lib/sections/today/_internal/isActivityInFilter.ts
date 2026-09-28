import type { FollowingActivity } from '$lib/requests/models/FollowingActivity.ts';
import type { TodayFilter } from '../models/TodayFilter.ts';

export function isActivityInFilter(
  activity: FollowingActivity,
  filter: TodayFilter,
): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'mine':
      return false;
    case 'watched':
      return activity.detail.action === 'watch';
    case 'rated':
      return activity.detail.action === 'rating';
    case 'comments':
      return activity.detail.action === 'comment';
  }
}
