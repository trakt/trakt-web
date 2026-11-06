import type { WatchingNowEntry } from '../models/WatchingNowEntry.ts';

export function hasSameWatchingEntries(
  a: ReadonlyArray<WatchingNowEntry>,
  b: ReadonlyArray<WatchingNowEntry>,
): boolean {
  return (
    a.length === b.length &&
    a.every(
      (entry, index) =>
        entry.key === b.at(index)?.key &&
        entry.nowPlaying === b.at(index)?.nowPlaying,
    )
  );
}
