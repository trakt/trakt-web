import type { TodayFriendAction } from '../models/TodayFriendAction.ts';

export function isTitleRating({ rating, target }: TodayFriendAction): boolean {
  return rating != null && (target === 'movie' || target === 'show');
}
