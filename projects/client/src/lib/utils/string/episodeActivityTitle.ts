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
  return `${episode.season}x${episode.number} - ${show.title}`;
}
