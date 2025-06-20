import type { WatchedEpisode } from '$lib/features/auth/queries/currentUserHistoryQuery.ts';

type Episode = { season: number; number: number };
type Season = {
  number: number;
  episodes: { count: number };
};

type GetEpisodesUntilProps = {
  previousSeasons: Season[];
  episode: Episode;
  watchedEpisodes?: WatchedEpisode[];
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
  { previousSeasons, episode, watchedEpisodes }: GetEpisodesUntilProps,
) {
  const previousSeasonEpisodes = previousSeasons
    .flatMap((season) => getSeasonUntil(season.number, season.episodes.count));

  const currentSeasonEpisodes = getSeasonUntil(episode.season, episode.number);

  const seasons = [
    ...previousSeasonEpisodes,
    currentSeasonEpisodes,
  ];

  return seasons
    .map((season) => ({
      number: season.number,
      episodes: season.episodes.filter((e) => {
        const isWatched = watchedEpisodes?.some(
          (we) => we.season === season.number && we.episode === e.number,
        );
        return !isWatched;
      }),
    }))
    .filter((s) => s.episodes.length > 0);
}
