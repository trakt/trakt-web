import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { useSeasonEpisodes } from '$lib/sections/lists/stores/useSeasonEpisodes.ts';
import { combineLatest, map, of } from 'rxjs';
import type { WatchUntilEpisode } from './calculateWatchUntilTimestamps.ts';

type SeasonRef = { number: number };

type UseWatchUntilHereEpisodesProps = {
  showSlug: string;
  targetEpisode: { season: number; number: number };
  previousSeasons: ReadonlyArray<SeasonRef>;
  currentSeasonEpisodes: ReadonlyArray<EpisodeEntry>;
  watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
};

function toWatchUntilEpisode(entry: EpisodeEntry): WatchUntilEpisode {
  return {
    id: entry.id,
    season: entry.season,
    number: entry.number,
    runtime: entry.runtime,
    effectiveReleaseDate: entry.effectiveReleaseDate,
  };
}

function filterUnwatched(
  episodes: ReadonlyArray<EpisodeEntry>,
  watched: ReadonlySet<number>,
  maxNumber?: number,
) {
  return episodes
    .filter((episode) =>
      !watched.has(episode.number) &&
      (maxNumber === undefined || episode.number <= maxNumber)
    )
    .toSorted((a, b) => a.number - b.number);
}

export function useWatchUntilHereEpisodes(
  {
    showSlug,
    targetEpisode,
    previousSeasons,
    currentSeasonEpisodes,
    watchedBySeason,
  }: UseWatchUntilHereEpisodesProps,
) {
  const previousResults = previousSeasons
    .filter((season) => season.number < targetEpisode.season)
    .toSorted((a, b) => a.number - b.number)
    .map((season) => {
      const watched = watchedBySeason.get(season.number) ?? new Set<number>();
      const { list, isLoading } = useSeasonEpisodes(showSlug, season.number);

      return {
        list: list.pipe(
          map((episodes) =>
            filterUnwatched(episodes, watched).map(toWatchUntilEpisode)
          ),
        ),
        isLoading,
      };
    });

  const currentWatched = watchedBySeason.get(targetEpisode.season) ??
    new Set<number>();
  const currentList = of(
    filterUnwatched(currentSeasonEpisodes, currentWatched, targetEpisode.number)
      .map(toWatchUntilEpisode),
  );

  const episodes = combineLatest(
    [...previousResults.map((entry) => entry.list), currentList],
  ).pipe(
    map((groups) => groups.flat()),
  );

  const isLoading = previousResults.length === 0
    ? of(false)
    : combineLatest(previousResults.map((entry) => entry.isLoading)).pipe(
      map((states) => states.some(Boolean)),
    );

  return { episodes, isLoading };
}
