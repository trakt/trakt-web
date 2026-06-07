export type WatchUntilMode =
  | 'just-now'
  | 'custom-end'
  | 'custom-start'
  | 'released';

export type WatchUntilEpisode = {
  id: number;
  season: number;
  number: number;
  runtime: number;
  effectiveReleaseDate: Date;
};

export type WatchUntilTimestamp = {
  episode: WatchUntilEpisode;
  watchedAt: Date;
};

type CalculateWatchUntilTimestampsParams = {
  episodes: ReadonlyArray<WatchUntilEpisode>;
  mode: WatchUntilMode;
  anchor?: Date;
  now?: Date;
  fallbackRuntime?: number;
};

const MINUTE_MS = 60_000;

function resolveRuntimeMs(runtime: number, fallback: number) {
  const minutes = Number.isFinite(runtime) && runtime > 0 ? runtime : fallback;
  return Math.max(0, minutes) * MINUTE_MS;
}

export function calculateWatchUntilTimestamps({
  episodes,
  mode,
  anchor,
  now,
  fallbackRuntime = 0,
}: CalculateWatchUntilTimestampsParams): ReadonlyArray<WatchUntilTimestamp> {
  if (episodes.length === 0) return [];

  if (mode === 'released') {
    return episodes.map((episode) => ({
      episode,
      watchedAt: episode.effectiveReleaseDate,
    }));
  }

  if (mode === 'custom-start') {
    if (!anchor) throw new Error('custom-start mode requires an anchor date');
    let cursor = anchor.getTime();
    return episodes.map((episode) => {
      cursor += resolveRuntimeMs(episode.runtime, fallbackRuntime);
      return { episode, watchedAt: new Date(cursor) };
    });
  }

  const finishAnchor = mode === 'just-now' ? (now ?? new Date()) : anchor;
  if (!finishAnchor) throw new Error('custom-end mode requires an anchor date');

  const lastIndex = episodes.length - 1;
  const result = new Array<WatchUntilTimestamp>(episodes.length);

  const lastEpisode = episodes.at(lastIndex);
  if (!lastEpisode) return result;

  result[lastIndex] = {
    episode: lastEpisode,
    watchedAt: finishAnchor,
  };

  for (let i = lastIndex - 1; i >= 0; i--) {
    const nextEntry = result.at(i + 1);
    const episode = episodes.at(i);
    if (!nextEntry || !episode) continue;

    const stepMs = resolveRuntimeMs(nextEntry.episode.runtime, fallbackRuntime);
    result[i] = {
      episode,
      watchedAt: new Date(nextEntry.watchedAt.getTime() - stepMs),
    };
  }

  return result;
}
