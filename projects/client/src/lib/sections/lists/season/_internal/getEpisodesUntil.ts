type Episode = { season: number; number: number };
type Season = {
  number: number;
  episodes: { count: number };
};

type GetEpisodesUntilProps = {
  previousSeasons: Season[];
  episode: Episode;
  watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
};

function getUnwatchedEpisodesForSeason(
  seasonNumber: number,
  episodeCount: number,
  watchedEpisodes: ReadonlySet<number>,
) {
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1)
    .filter((n) => !watchedEpisodes.has(n))
    .map((n) => ({ number: n }));

  return { number: seasonNumber, episodes };
}

export function getEpisodesUntil(
  { previousSeasons, episode, watchedBySeason }: GetEpisodesUntilProps,
) {
  const previousSeasonEpisodes = previousSeasons
    .map((season) =>
      getUnwatchedEpisodesForSeason(
        season.number,
        season.episodes.count,
        watchedBySeason.get(season.number) ?? new Set(),
      )
    )
    .filter((season) => season.episodes.length > 0);

  const currentSeasonWatched = watchedBySeason.get(episode.season) ?? new Set();
  const currentSeasonEpisodes = getUnwatchedEpisodesForSeason(
    episode.season,
    episode.number,
    currentSeasonWatched,
  );

  return [...previousSeasonEpisodes, currentSeasonEpisodes];
}
