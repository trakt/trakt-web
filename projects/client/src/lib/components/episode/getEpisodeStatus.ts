import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CoalescedEpisodes } from './CoalescedEpisodes.ts';

type EpisodeStatus = 'premiere' | 'finale' | 'new';

type GetEpisodeStatusOptions = {
  isLatestAired?: boolean;
  releaseDate?: Date;
  episodes?: CoalescedEpisodes;
};

const PREMIERE_TYPES: ReadonlySet<EpisodeType> = new Set(
  Object.values<EpisodeType>(EpisodePremiereType),
);

const FINALE_TYPES: ReadonlySet<EpisodeType> = new Set(
  Object.values<EpisodeType>(EpisodeFinaleType),
);

const MID_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeFinaleType.mid_season_finale,
  EpisodePremiereType.mid_season_premiere,
]);

const COALESCED_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeComputedType.full_season,
  EpisodeComputedType.multiple_episodes,
]);

function isEpisodeNew(releaseDate: Date): boolean {
  const newEpisodeWindowMs = time.days(7);
  const elapsed = Date.now() - releaseDate.getTime();
  return elapsed >= 0 && elapsed <= newEpisodeWindowMs;
}

function resolveEpisodeType(
  type: EpisodeType,
  episodes: CoalescedEpisodes,
): EpisodeType {
  if (!COALESCED_TYPES.has(type)) {
    return type;
  }

  const childTypes = episodes?.map((episode) => episode.type) ?? [];

  return childTypes.find((child) => PREMIERE_TYPES.has(child)) ??
    childTypes.find((child) => FINALE_TYPES.has(child)) ??
    type;
}

export function getEpisodeStatus(
  type: EpisodeType,
  options: GetEpisodeStatusOptions = {},
): EpisodeStatus | Nil {
  const resolvedType = resolveEpisodeType(type, options.episodes);

  const isPremiere = PREMIERE_TYPES.has(resolvedType);
  const isFinale = FINALE_TYPES.has(resolvedType);

  if (!isPremiere && !isFinale) {
    if (options.releaseDate && isEpisodeNew(options.releaseDate)) {
      return 'new';
    }
    return;
  }

  const isMidSeason = MID_SEASON_TYPES.has(resolvedType);
  if (isMidSeason && options.isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
