import {
  EpisodeComputedType,
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { CoalescedEpisodes } from './CoalescedEpisodes.ts';
import type { EpisodeStatus } from './EpisodeStatus.ts';

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

type EpisodeMilestone = Extract<EpisodeStatus, 'premiere' | 'finale'>;

const NEW_MILESTONE_STATUS = {
  premiere: 'new-premiere',
  finale: 'new-finale',
} as const satisfies Record<EpisodeMilestone, EpisodeStatus>;

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

function resolveMilestone(
  type: EpisodeType,
  isLatestAired?: boolean,
): EpisodeMilestone | Nil {
  const isPremiere = PREMIERE_TYPES.has(type);
  const isFinale = FINALE_TYPES.has(type);

  if (!isPremiere && !isFinale) {
    return;
  }

  if (MID_SEASON_TYPES.has(type) && isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}

export function getEpisodeStatus(
  type: EpisodeType,
  options: GetEpisodeStatusOptions = {},
): EpisodeStatus | Nil {
  const resolvedType = resolveEpisodeType(type, options.episodes);
  const milestone = resolveMilestone(resolvedType, options.isLatestAired);
  const isNew = options.releaseDate != null &&
    isEpisodeNew(options.releaseDate);

  if (!isNew) {
    return milestone;
  }

  return milestone ? NEW_MILESTONE_STATUS[milestone] : 'new';
}
