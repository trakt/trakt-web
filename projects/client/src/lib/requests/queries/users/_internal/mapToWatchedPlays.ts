import type { WatchedPlay } from '$lib/requests/models/WatchedPlay.ts';
import type { WatchedPlayResponse } from './WatchedPlayResponseSchema.ts';

export function mapToWatchedPlays(
  plays: WatchedPlayResponse[],
): WatchedPlay[] {
  return plays
    .map((play) => ({
      id: play.id,
      watchedAt: new Date(play.watched_at),
    }))
    .sort((a, b) => b.watchedAt.getTime() - a.watchedAt.getTime());
}
