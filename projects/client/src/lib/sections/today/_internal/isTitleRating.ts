import type { TodayFriendAction } from '../models/TodayFriendAction.ts';

export function isTitleRating({ kind, target }: TodayFriendAction): boolean {
  return kind === 'rating' && (target === 'movie' || target === 'show');
}
