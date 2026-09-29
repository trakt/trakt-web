import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import type { TodayMedia } from '../models/TodayMedia.ts';

type HasWatchedTooParams = {
  history: UserHistory | Nil;
  media: TodayMedia;
};

export function hasWatchedToo(
  { history, media }: HasWatchedTooParams,
): boolean {
  if (!history) return false;

  if (media.type === 'movie') return history.movies.has(media.id);

  return (history.shows.get(media.id)?.episodes.length ?? 0) > 0;
}
