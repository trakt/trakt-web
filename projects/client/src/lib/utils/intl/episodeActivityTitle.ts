import { episodeNumberLabel } from './episodeNumberLabel.ts';

type Episode = {
  season: number;
  number: number;
};

type Show = {
  title: string;
};

export function episodeActivityTitle(
  episode: Episode,
  show: Show,
) {
  return `${
    episodeNumberLabel({
      seasonNumber: episode.season,
      episodeNumber: episode.number,
    })
  } - ${show.title}`;
}
