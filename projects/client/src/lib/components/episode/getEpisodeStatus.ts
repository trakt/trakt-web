import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CoalescedEpisodes } from './CoalescedEpisodes.ts';

type EpisodeStatus = 'new-season' | 'premiere' | 'finale' | 'new';

type GetEpisodeStatusOptions = {
  isLatestAired?: boolean;
  releaseDate?: Date;
  episodes?: CoalescedEpisodes;
};

const MID_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeFinaleType.mid_season_finale,
  EpisodePremiereType.mid_season_premiere,
]);

const NEW_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodePremiereType.series_premiere,
  EpisodePremiereType.season_premiere,
]);

const COALESCED_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeComputedType.full_season,
  EpisodeComputedType.multiple_episodes,
]);

const NEW_EPISODE_WINDOW_MS = time.days(7);

function isEpisodeNew(releaseDate: Date): boolean {
  const elapsed = Date.now() - releaseDate.getTime();
  return elapsed >= 0 && elapsed <= NEW_EPISODE_WINDOW_MS;
}

function isNewSeason(
  type: EpisodeType,
  episodes: CoalescedEpisodes,
): boolean {
  if (NEW_SEASON_TYPES.has(type)) {
    return true;
  }

  if (!COALESCED_TYPES.has(type)) {
    return false;
  }

  return episodes?.some((episode) => NEW_SEASON_TYPES.has(episode.type)) ??
    false;
}

export function getEpisodeStatus(
  type: EpisodeType,
  options: GetEpisodeStatusOptions = {},
): EpisodeStatus | Nil {
  if (isNewSeason(type, options.episodes)) {
    return 'new-season';
  }

  const isPremiere = Object
    .values<EpisodeType>(EpisodePremiereType)
    .includes(type);

  const isFinale = Object
    .values<EpisodeType>(EpisodeFinaleType)
    .includes(type);

  if (!isPremiere && !isFinale) {
    if (options.releaseDate && isEpisodeNew(options.releaseDate)) {
      return 'new';
    }
    return;
  }

  const isMidSeason = MID_SEASON_TYPES.has(type);
  if (isMidSeason && options.isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
