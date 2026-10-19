import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';

type FindNextEpisodeToWatchProps = {
  season: number;
  episodes: ReadonlyArray<Pick<EpisodeEntry, 'number'>>;
  watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
  previousSeasonEpisodeCount?: number;
};

const SPECIAL_SEASON = 0;

function findNewestWatched(
  watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>,
) {
  const season = Math.max(
    ...[...watchedBySeason]
      .filter(([number, episodes]) => number > SPECIAL_SEASON && episodes.size)
      .map(([number]) => number),
  );
  if (!Number.isFinite(season)) return undefined;

  const episode = Math.max(...(watchedBySeason.get(season) ?? []));
  return { season, episode };
}

export function findNextEpisodeToWatch({
  season,
  episodes,
  watchedBySeason,
  previousSeasonEpisodeCount,
}: FindNextEpisodeToWatchProps) {
  const newest = findNewestWatched(watchedBySeason);
  if (!newest) return undefined;

  if (newest.season === season) {
    return episodes.find(({ number }) => number > newest.episode)?.number;
  }

  const hasFinishedPreviousSeason =
    newest.season === season - 1 &&
    previousSeasonEpisodeCount != null &&
    newest.episode >= previousSeasonEpisodeCount;
  if (!hasFinishedPreviousSeason) return undefined;

  return episodes.at(0)?.number;
}
