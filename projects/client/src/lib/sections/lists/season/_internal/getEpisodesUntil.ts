type Episode = { season: number; number: number };
type Season = {
  number: number;
  episodes: { count: number };
};

type GetEpisodesUntilProps = {
  previousSeasons: Season[];
  episode: Episode;
};

function getSeasonUntil(seasonNumber: number, episodeCount: number) {
  return {
    number: seasonNumber,
    episodes: Array.from({ length: episodeCount }, (_, i) => ({
      number: i + 1,
    })),
  };
}

export function getEpisodesUntil(
  { previousSeasons, episode }: GetEpisodesUntilProps,
) {
  const previousSeasonEpisodes = previousSeasons
    .flatMap((season) => getSeasonUntil(season.number, season.episodes.count));

  const currentSeasonEpisodes = getSeasonUntil(episode.season, episode.number);

  return [
    ...previousSeasonEpisodes,
    currentSeasonEpisodes,
  ];
}
