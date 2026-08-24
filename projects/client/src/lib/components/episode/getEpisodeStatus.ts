import {
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';
import { time } from '$lib/utils/timing/time.ts';

type EpisodeStatus = 'premiere' | 'finale' | 'new';

type GetEpisodeStatusOptions = {
  isLatestAired?: boolean;
  releaseDate?: Date;
};

function isEpisodeNew(releaseDate: Date): boolean {
  const newEpisodeWindowMs = time.days(7);
  const elapsed = Date.now() - releaseDate.getTime();
  return elapsed >= 0 && elapsed <= newEpisodeWindowMs;
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

  if (!isPremiere && !isFinale) {
    if (options.releaseDate && isEpisodeNew(options.releaseDate)) {
      return 'new';
    }
    return;
  }

  const isMidSeason = type === EpisodeFinaleType.mid_season_finale ||
    type === EpisodePremiereType.mid_season_premiere;
  if (isMidSeason && options.isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
