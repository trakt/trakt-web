import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeStats } from '$lib/requests/models/EpisodeStats.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStats } from '$lib/requests/models/MediaStats.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';

type Stats = MediaStats | EpisodeStats;

type GetDisplayableStatsProps = {
  stats: Stats;
  entry: MediaEntry | EpisodeEntry;
};

export const EMPTY_EPISODE_STATS: EpisodeStats = Object.freeze({
  watchers: 0,
  plays: 0,
  collectors: 0,
  comments: 0,
  lists: 0,
});

export const EMPTY_MEDIA_STATS: MediaStats = Object.freeze({
  ...EMPTY_EPISODE_STATS,
  favorited: 0,
  votes: 0,
});

export function getDisplayableStats(
  { stats, entry }: GetDisplayableStatsProps,
): Stats {
  if (hasAired(entry)) {
    return stats;
  }

  if ('favorited' in stats) {
    return { ...EMPTY_MEDIA_STATS, lists: stats.lists };
  }

  return { ...EMPTY_EPISODE_STATS, lists: stats.lists };
}
