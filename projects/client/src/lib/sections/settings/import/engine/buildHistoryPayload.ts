import type { HistoryAddRequest } from '@trakt/api';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { EPISODE_IDS, MOVIE_IDS, pickIds, SHOW_IDS } from './pickIds.ts';

type HistoryMovie = NonNullable<HistoryAddRequest['movies']>[number];
type HistoryShow = NonNullable<HistoryAddRequest['shows']>[number];
type HistoryEpisode = NonNullable<HistoryAddRequest['episodes']>[number];

function toHistoryMovie(
  { ids, title, year, watched_at }: UniversalImportItem,
): HistoryMovie | null {
  const resolvedIds = pickIds(ids, MOVIE_IDS);
  if (resolvedIds) return { ids: resolvedIds as never, watched_at };
  if (title && year) return { title, year, watched_at };
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

export function buildHistoryPayload(
  items: UniversalImportItem[],
): HistoryAddRequest {
  const episodeItems = items.filter((item) => item.type === 'episode');

  const movies = items
    .filter((item) => item.type === 'movie')
    .flatMap((item) => toHistoryMovie(item) ?? []);

  const episodes: HistoryEpisode[] = episodeItems.flatMap(
    ({ ids, watched_at }) => {
      const resolvedIds = pickIds(ids, EPISODE_IDS);
      return resolvedIds ? [{ ids: resolvedIds as never, watched_at }] : [];
    },
  );

  const shows: HistoryShow[] = [
    ...items
      .filter((item) => item.type === 'show')
      .flatMap((item) => toHistoryShow(item) ?? []),
    ...episodeItems.flatMap(({ ids, watched_at }) => {
      const resolvedIds = pickIds(ids, EPISODE_IDS);
      return !resolvedIds && ids.imdb
        ? [{ ids: { imdb: ids.imdb } as never, watched_at }]
        : [];
    }),
  ];

  return { movies, shows, episodes };
}
