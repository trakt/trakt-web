import type { ShowProgress } from '$lib/requests/models/ShowProgress.ts';
import type { UpNextResponse } from '@trakt/api';

export function mapToShowProgress(
  progress: UpNextResponse['progress'],
): ShowProgress {
  return {
    total: progress.aired,
    completed: progress.completed,
    remaining: progress.aired - progress.completed,
    minutesLeft: progress.stats?.minutes_left ?? 0,
    lastWatchedAt: progress.last_watched_at
      ? new Date(progress.last_watched_at)
      : null,
  };
}
