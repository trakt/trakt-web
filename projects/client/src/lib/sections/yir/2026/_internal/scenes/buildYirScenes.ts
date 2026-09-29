import type {
  YirCompany,
  YirCountriesGroup,
  YirDetail,
  YirGenresGroup,
  YirMostWatchedItem,
  YirStatsCategory,
  YirTopRatedItem,
  YirTrendItem,
  YirWatchedItem,
} from '$lib/requests/models/YirDetail.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

type MediaType = 'shows' | 'movies';

export type YirSceneSpec =
  | { kind: 'play'; id: string; moment: 'first' | 'last'; item: YirWatchedItem }
  | { kind: 'stats'; id: string; type: MediaType; stats: YirStatsCategory }
  | { kind: 'top'; id: string; type: MediaType; items: YirMostWatchedItem[] }
  | { kind: 'companies'; id: string; type: MediaType; companies: YirCompany[] }
  | { kind: 'genres'; id: string; type: MediaType; group: YirGenresGroup }
  | { kind: 'rated'; id: string; type: MediaType; items: YirTopRatedItem[] }
  | { kind: 'countries'; id: string; type: MediaType; group: YirCountriesGroup }
  | { kind: 'trends'; id: string; type: MediaType; items: YirTrendItem[] }
  | { kind: 'credits'; id: string }
  | {
    kind: 'thanks';
    id: string;
    shows: MediaEntry[];
    movies: MediaEntry[];
  };

function mediaScenes(
  detail: YirDetail,
  type: MediaType,
): ReadonlyArray<YirSceneSpec> {
  const stats = detail.stats[type];
  if (stats.playCounts.total === 0) return [];

  const companies = type === 'shows' ? detail.networks : detail.studios;
  const trends = detail.trends?.[type] ?? [];

  return [
    { kind: 'stats', id: `section-${type}-stats`, type, stats },
    ...(detail.mostWatched[type].length > 0
      ? [{
        kind: 'top' as const,
        id: `section-${type}-most-watched`,
        type,
        items: detail.mostWatched[type].slice(0, 10),
      }]
      : []),
    ...(companies.length > 0
      ? [{
        kind: 'companies' as const,
        id: `section-${type}-companies`,
        type,
        companies,
      }]
      : []),
    ...(detail.genres[type].itemCount > 0
      ? [{
        kind: 'genres' as const,
        id: `section-${type}-genres`,
        type,
        group: detail.genres[type],
      }]
      : []),
    ...(detail.topRated[type].length > 0
      ? [{
        kind: 'rated' as const,
        id: `section-${type}-rated`,
        type,
        items: detail.topRated[type],
      }]
      : []),
    ...(detail.countries[type].countryCount > 0
      ? [{
        kind: 'countries' as const,
        id: `section-${type}-countries`,
        type,
        group: detail.countries[type],
      }]
      : []),
    ...(trends.length > 0
      ? [{
        kind: 'trends' as const,
        id: `section-${type}-trends`,
        type,
        items: trends,
      }]
      : []),
  ];
}

export function buildYirScenes(
  detail: YirDetail | null,
): ReadonlyArray<YirSceneSpec> {
  if (!detail) return [];

  const thanks = detail.thanks;

  return [
    ...(detail.firstWatched
      ? [{
        kind: 'play' as const,
        id: 'section-first-play',
        moment: 'first' as const,
        item: detail.firstWatched,
      }]
      : []),
    ...mediaScenes(detail, 'shows'),
    ...mediaScenes(detail, 'movies'),
    { kind: 'credits', id: 'section-people' },
    ...(detail.lastWatched
      ? [{
        kind: 'play' as const,
        id: 'section-last-play',
        moment: 'last' as const,
        item: detail.lastWatched,
      }]
      : []),
    ...(thanks && (thanks.shows.length > 0 || thanks.movies.length > 0)
      ? [{
        kind: 'thanks' as const,
        id: 'section-thanks',
        shows: thanks.shows,
        movies: thanks.movies,
      }]
      : []),
  ];
}
