import type { BulkIntlTarget } from '$lib/features/intl-overlay/BulkIntlTarget.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type {
  YirDetail,
  YirWatchedItem,
} from '$lib/requests/models/YirDetail.ts';

type EntryMapper = (entry: MediaEntry) => MediaEntry;
type EntryVisitor = (entry: MediaEntry) => void;

/**
 * Read-only traversal that visits every localizable media entry the detail
 * carries (most-watched, top-rated, trends, first/last play and the closing
 * recommendations) without allocating. Used to enumerate the overlay targets.
 */
function forEachYirEntry(detail: YirDetail, visit: EntryVisitor): void {
  const visitItems = (items: ReadonlyArray<{ entry: MediaEntry }>) => {
    for (const item of items) visit(item.entry);
  };

  visitItems(detail.mostWatched.shows);
  visitItems(detail.mostWatched.movies);
  visitItems(detail.topRated.shows);
  visitItems(detail.topRated.movies);
  if (detail.trends) {
    visitItems(detail.trends.shows);
    visitItems(detail.trends.movies);
  }
  if (detail.firstWatched) visit(detail.firstWatched.entry);
  if (detail.lastWatched) visit(detail.lastWatched.entry);
  if (detail.thanks) {
    detail.thanks.shows.forEach(visit);
    detail.thanks.movies.forEach(visit);
  }
}

/**
 * Rebuilds an immutable copy of `detail` with `mapEntry` applied to every
 * localizable media entry it carries. Used by each target's `apply` to rewrite
 * a single title across the detail.
 */
function mapYirEntries(detail: YirDetail, mapEntry: EntryMapper): YirDetail {
  const mapItems = <T extends { entry: MediaEntry }>(items: ReadonlyArray<T>) =>
    items.map((item) => ({ ...item, entry: mapEntry(item.entry) }));

  const mapWatched = (watched: YirWatchedItem | Nil) =>
    watched ? { ...watched, entry: mapEntry(watched.entry) } : watched;

  return {
    ...detail,
    mostWatched: {
      shows: mapItems(detail.mostWatched.shows),
      movies: mapItems(detail.mostWatched.movies),
    },
    topRated: {
      shows: mapItems(detail.topRated.shows),
      movies: mapItems(detail.topRated.movies),
    },
    trends: detail.trends
      ? {
        shows: mapItems(detail.trends.shows),
        movies: mapItems(detail.trends.movies),
      }
      : detail.trends,
    firstWatched: mapWatched(detail.firstWatched),
    lastWatched: mapWatched(detail.lastWatched),
    thanks: detail.thanks
      ? {
        shows: detail.thanks.shows.map(mapEntry),
        movies: detail.thanks.movies.map(mapEntry),
      }
      : detail.thanks,
  };
}

/**
 * `getTargets` for the bulk intl overlay over a whole `YirDetail`. Collects one
 * target per distinct (type, id) media entry; each target's `apply` rewrites
 * the title of every matching entry across the detail so a single fetched
 * localization lands everywhere the title appears.
 */
export function yirDetailTargets(
  detail: YirDetail,
): ReadonlyArray<BulkIntlTarget<YirDetail>> {
  const targets = new Map<string, BulkIntlTarget<YirDetail>>();

  forEachYirEntry(detail, (entry) => {
    const key = `${entry.type}:${entry.id}`;
    if (targets.has(key)) return;

    targets.set(key, {
      id: entry.id,
      type: entry.type,
      apply: (target, title) =>
        mapYirEntries(
          target,
          (candidate) =>
            candidate.id === entry.id && candidate.type === entry.type
              ? { ...candidate, title }
              : candidate,
        ),
    });
  });

  return [...targets.values()];
}
