import type { WatchUntilTimestamp } from './calculateWatchUntilTimestamps.ts';

type SeasonEpisodes = {
  number: number;
  episodes: Array<{ number: number; watched_at: string }>;
};

type WatchUntilHereMedia = {
  id: number;
  effectiveReleaseDate: Date;
  seasons: SeasonEpisodes[];
};

type BuildWatchUntilHereMediaProps = {
  showId: number;
  showReleaseDate: Date;
  timestamps: ReadonlyArray<WatchUntilTimestamp>;
};

export function buildWatchUntilHereMedia(
  { showId, showReleaseDate, timestamps }: BuildWatchUntilHereMediaProps,
): WatchUntilHereMedia {
  const seasons = new Map<number, SeasonEpisodes>();

  for (const { episode, watchedAt } of timestamps) {
    const existing = seasons.get(episode.season) ?? {
      number: episode.season,
      episodes: [],
    };
    existing.episodes.push({
      number: episode.number,
      watched_at: watchedAt.toISOString(),
    });
    seasons.set(episode.season, existing);
  }

  return {
    id: showId,
    effectiveReleaseDate: showReleaseDate,
    seasons: Array.from(seasons.values()).toSorted((a, b) =>
      a.number - b.number
    ),
  };
}
