import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { TodayMilestone } from '../models/TodayMilestone.ts';
import { strongestMilestone } from './strongestMilestone.ts';

type EpisodeLike = Pick<EpisodeEntry, 'type' | 'season' | 'number'>;

function episodeMilestone(episode: EpisodeLike): TodayMilestone | null {
  const { season } = episode;

  switch (episode.type) {
    case 'series_finale':
      return { type: 'series-end', season };
    case 'season_finale':
      return { type: 'season-end', season };
    case 'series_premiere':
      return { type: 'series-start', season };
    case 'season_premiere':
      return season === 1 && episode.number === 1
        ? { type: 'series-start', season }
        : { type: 'season-start', season };
  }

  if (season === 1 && episode.number === 1) {
    return { type: 'series-start', season };
  }

  return null;
}

export function toMilestone(
  episode: EpisodeEntry | Nil,
): TodayMilestone | null {
  if (!episode) return null;

  return strongestMilestone([
    episodeMilestone(episode),
    ...(episode.episodes ?? []).map(episodeMilestone),
  ]);
}
