import {
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';

type EpisodeStatus = 'premiere' | 'finale';

type GetEpisodeStatusOptions = {
  isLatestAired?: boolean;
};

const MID_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeFinaleType.mid_season_finale,
  EpisodePremiereType.mid_season_premiere,
]);

export function getEpisodeStatus(
  type: EpisodeType,
  options: GetEpisodeStatusOptions = {},
): EpisodeStatus | Nil {
  const isPremiere = Object
    .values<EpisodeType>(EpisodePremiereType)
    .includes(type);

  const isFinale = Object
    .values<EpisodeType>(EpisodeFinaleType)
    .includes(type);

  if (!isPremiere && !isFinale) {
    return;
  }

  const isMidSeason = MID_SEASON_TYPES.has(type);
  if (isMidSeason && options.isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
