import {
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';

type EpisodeStatus = 'premiere' | 'finale' | 'new';

type GetEpisodeStatusOptions = {
  isLatestAired?: boolean;
  releaseDate?: Date;
};

const MID_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeFinaleType.mid_season_finale,
  EpisodePremiereType.mid_season_premiere,
]);

const DAYS_IN_A_WEEK = 7;

function isEpisodeNew(releaseDate: Date): boolean {
  const now = new Date();
  const timeDifference = now.getTime() - releaseDate.getTime();
  const daysPassed = timeDifference / (1000 * 60 * 60 * 24);
  return daysPassed >= 0 && daysPassed <= DAYS_IN_A_WEEK;
}

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

  if (isPremiere || isFinale) {
    const isMidSeason = MID_SEASON_TYPES.has(type);
    if (isMidSeason && options.isLatestAired === false) {
      return;
    }

    return isPremiere ? 'premiere' : 'finale';
  }

  if (options.releaseDate && isEpisodeNew(options.releaseDate)) {
    return 'new';
  }

  return;
}
