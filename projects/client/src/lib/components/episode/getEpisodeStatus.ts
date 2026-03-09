import {
  EpisodeFinaleType,
  EpisodePremiereType,
  type EpisodeType,
} from '$lib/requests/models/EpisodeType.ts';

type EpisodeStatus = 'premiere' | 'finale';

export function getEpisodeStatus(type: EpisodeType): EpisodeStatus | Nil {
  const isPremiere = Object
    .values<EpisodeType>(EpisodePremiereType)
    .includes(type);

  const isFinale = Object
    .values<EpisodeType>(EpisodeFinaleType)
    .includes(type);

  if (!isPremiere && !isFinale) {
    return;
  }

  return isPremiere ? 'premiere' : 'finale';
}
