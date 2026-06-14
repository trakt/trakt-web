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

const MID_SEASON_TYPES: ReadonlySet<EpisodeType> = new Set([
  EpisodeFinaleType.mid_season_finale,
  EpisodePremiereType.mid_season_premiere,
]);

const NEW_EPISODE_WINDOW_MS = time.days(7);

function isEpisodeNew(releaseDate: Date): boolean {
  const elapsed = Date.now() - releaseDate.getTime();
  return elapsed >= 0 && elapsed <= NEW_EPISODE_WINDOW_MS;
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

  const isMidSeason = MID_SEASON_TYPES.has(type);
  if (isMidSeason && options.isLatestAired === false) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
