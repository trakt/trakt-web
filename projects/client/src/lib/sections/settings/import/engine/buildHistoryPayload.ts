import type { HistoryAddRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { EPISODE_IDS, MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

type HistoryMovie = NonNullable<HistoryAddRequest['movies']>[number];
type HistoryShow = NonNullable<HistoryAddRequest['shows']>[number];
type HistoryEpisode = NonNullable<HistoryAddRequest['episodes']>[number];

// Movies never fall back to {title, year}: server-side text matching
// is too fuzzy and mismatches pollute history. Unresolved movies are
// dropped instead (resolveMovieIds runs before this).
function toHistoryMovie(
  { ids, watched_at }: UniversalImportItem,
): HistoryMovie | null {
  const resolvedIds = pickIds(ids, MOVIE_IDS);
  if (resolvedIds) return { ids: resolvedIds as never, watched_at };
  return null;
}

function toHistoryShow(
  { ids, title, year, watched_at }: UniversalImportItem,
): HistoryShow | null {
  const resolvedIds = pickIds(ids, SHOW_IDS);
  if (resolvedIds) return { ids: resolvedIds as never, watched_at };
  if (title && year) return { title, year, watched_at };
  return null;
}

// Prefer positional resolution (show id + season/episode number) over the
// episode's own id: many Trakt episodes have no TVDB id, while the show does,
// and (show, season, number) identifies an episode unambiguously.
function isPositional(
  item: UniversalImportItem,
): item is UniversalImportItem & { season: number; episode: number } {
  return (item.showTvdb != null || item.showImdb != null) &&
    item.season != null && item.episode != null;
}

type PositionalEpisode = { number: number; watched_at?: string };
type ShowIds = { tvdb?: number; imdb?: string };
type ShowGroup = { ids: ShowIds; seasons: Map<number, PositionalEpisode[]> };

function toShowIds(item: UniversalImportItem): ShowIds {
  return {
    ...(item.showTvdb != null ? { tvdb: item.showTvdb } : {}),
    ...(item.showImdb != null ? { imdb: item.showImdb } : {}),
  };
}

// Fold positional episodes into `shows`: one entry per show carrying its
// watched seasons -> episodes-by-number, each keeping its own watched_at. The
// show id block merges tvdb and/or imdb across items so shows missing a TVDB id
// still resolve. Keyed on tvdb (else imdb) so the same show grouped from two
// serializations - one carrying imdb, one not - collapses into one entry.
function toPositionalShows(
  items: ReadonlyArray<
    UniversalImportItem & { season: number; episode: number }
  >,
): HistoryShow[] {
  const byShow = items.reduce((shows, item) => {
    const key = item.showTvdb != null
      ? `tvdb:${item.showTvdb}`
      : `imdb:${item.showImdb}`;
    const group = shows.get(key) ??
      { ids: {} as ShowIds, seasons: new Map<number, PositionalEpisode[]>() };
    const episodes = group.seasons.get(item.season) ?? [];
    group.seasons.set(item.season, [
      ...episodes,
      { number: item.episode, watched_at: item.watched_at },
    ]);
    return shows.set(key, {
      ids: { ...group.ids, ...toShowIds(item) },
      seasons: group.seasons,
    });
  }, new Map<string, ShowGroup>());

  return [...byShow.values()].map(({ ids, seasons }) => ({
    ids,
    seasons: [...seasons].map(([number, episodes]) => ({ number, episodes })),
  })) as unknown as HistoryShow[];
}

export function buildHistoryPayload(
  items: UniversalImportItem[],
): HistoryAddRequest {
  const episodeItems = items.filter((item) => item.type === 'episode');
  const positionalEpisodes = episodeItems.filter(isPositional);
  const idEpisodes = episodeItems.filter((item) => !isPositional(item));

  const movies = items
    .filter((item) => item.type === 'movie')
    .flatMap((item) => toHistoryMovie(item) ?? []);

  const episodes: HistoryEpisode[] = idEpisodes.flatMap(
    ({ ids, watched_at }) => {
      const resolvedIds = pickIds(ids, EPISODE_IDS);
      return resolvedIds ? [{ ids: resolvedIds as never, watched_at }] : [];
    },
  );

  const shows: HistoryShow[] = [
    ...items
      .filter((item) => item.type === 'show')
      .flatMap((item) => toHistoryShow(item) ?? []),
    ...toPositionalShows(positionalEpisodes),
    ...idEpisodes.flatMap(({ ids, watched_at }) => {
      const resolvedIds = pickIds(ids, EPISODE_IDS);
      return !resolvedIds && ids.imdb
        ? [{ ids: { imdb: ids.imdb } as never, watched_at }]
        : [];
    }),
  ];

  return { movies, shows, episodes };
}
