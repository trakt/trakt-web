import * as m from '$lib/features/i18n/messages.ts';
import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import { toTranslatedGenre } from '$lib/utils/formatting/string/toTranslatedGenre.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { useActivityHistory } from './activityHistoryParams.ts';

type UseGenreBreakdownProps = { readonly slug: string };

export type GenreDayData = {
  readonly date: Date;
  readonly segments: ReadonlyArray<{ readonly genre: string; readonly count: number }>;
  readonly total: number;
};

export type GenreLegendEntry = {
  readonly genre: string;
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
};

export type GenreBreakdownData = {
  readonly days: ReadonlyArray<GenreDayData>;
  readonly legend: ReadonlyArray<GenreLegendEntry>;
  readonly maxDayTotal: number;
};

const genreColors = [
  '#a87cf0', // purple - slot 1
  '#6ea1f7', // blue - slot 2
  '#4ecdc4', // teal - slot 3
  '#7bc67e', // green - slot 4
  '#f0a04b', // orange - slot 5
  '#555555', // gray - "Other"
];

const topGenreCount = 5;
export const DAY_COUNT = 14;
const genresPerEntry = 2;

export function computeGenreBreakdown(
  movies: ReadonlyArray<MovieActivityHistory>,
  shows: ReadonlyArray<ShowActivityHistory>,
  now: Date,
): GenreBreakdownData {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const days = Array.from({ length: DAY_COUNT }, (_, i) =>
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (DAY_COUNT - 1 - i),
    ),
  );

  const rangeStart = days[0] ?? today;
  const rangeEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  type GenreEntry = {
    readonly watchedAt: Date;
    readonly genre: string;
    readonly weight: number;
  };

  const collectEntries = (
    entries: ReadonlyArray<{ watchedAt: Date; genres: readonly string[] }>,
  ): GenreEntry[] =>
    entries.flatMap((entry) => {
      if (entry.watchedAt < rangeStart || entry.watchedAt >= rangeEnd) {
        return [];
      }
      const genres = entry.genres.length > 0
        ? entry.genres.slice(0, genresPerEntry)
        : ['other'];
      const weight = 1 / genres.length;
      return genres.map((genre) => ({
        watchedAt: entry.watchedAt,
        genre,
        weight,
      }));
    });

  const genreEntries = [
    ...collectEntries(
      movies.map((e) => ({
        watchedAt: e.watchedAt,
        genres: e.movie.genres,
      })),
    ),
    ...collectEntries(
      shows.map((e) => ({
        watchedAt: e.watchedAt,
        genres: e.show.genres,
      })),
    ),
  ];

  // Count genres globally (weighted) to find top 5
  const globalCounts = genreEntries.reduce((acc, { genre, weight }) => {
    acc.set(genre, (acc.get(genre) ?? 0) + weight);
    return acc;
  }, new Map<string, number>());

  const sortedGenres = [...globalCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  );

  const topGenres = sortedGenres
    .slice(0, topGenreCount)
    .map(([genre]) => genre);

  const topGenreSet = new Set(topGenres);

  const genreOrder = [...topGenres];
  const hasOther =
    sortedGenres.length > topGenreCount || topGenreSet.has('other');
  if (hasOther && !topGenreSet.has('other')) {
    genreOrder.push('other');
  }

  // Group entries by day (weighted)
  const dayGenreCounts = new Map<string, Map<string, number>>();
  for (const day of days) {
    dayGenreCounts.set(getDayKey(day), new Map());
  }

  for (const { watchedAt, genre, weight } of genreEntries) {
    const key = getDayKey(watchedAt);
    const dayCounts = dayGenreCounts.get(key);
    if (!dayCounts) continue;

    const effectiveGenre = topGenreSet.has(genre) ? genre : 'other';
    dayCounts.set(
      effectiveGenre,
      (dayCounts.get(effectiveGenre) ?? 0) + weight,
    );
  }

  // Build day data
  const dayData: GenreDayData[] = days.map((date) => {
    const dayCounts = dayGenreCounts.get(getDayKey(date)) ?? new Map<string, number>();
    const segments = genreOrder.map((genre) => ({
      genre,
      count: dayCounts.get(genre) ?? 0,
    }));
    const total = segments.reduce((sum, s) => sum + s.count, 0);
    return { date, segments, total };
  });

  const maxDayTotal = Math.max(...dayData.map((d) => d.total), 0);

  // Build legend
  const totalWeight = genreEntries.reduce((s, e) => s + e.weight, 0);
  const legend: GenreLegendEntry[] = genreOrder.map((genre, i) => {
    const count =
      genre === 'other'
        ? sortedGenres
            .filter(([g]) => !topGenreSet.has(g))
            .reduce((sum, [, c]) => sum + c, 0) +
          (topGenreSet.has('other')
            ? (globalCounts.get('other') ?? 0)
            : 0)
        : (globalCounts.get(genre) ?? 0);

    return {
      genre,
      label:
        genre === 'other'
          ? m.text_stats_genre_other()
          : toTranslatedGenre(genre),
      percentage:
        totalWeight > 0 ? Math.round((count / totalWeight) * 100) : 0,
      color: genreColors[Math.min(i, genreColors.length - 1)] ?? '#555555',
    };
  });

  return { days: dayData, legend, maxDayTotal };
}

export function useGenreBreakdown({ slug }: UseGenreBreakdownProps): {
  data: Observable<GenreBreakdownData>;
  isLoading: Observable<boolean>;
} {
  const { movies, shows, isLoadingMovies, isLoadingShows } =
    useActivityHistory(slug);

  const now = new Date();

  const data = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => computeGenreBreakdown($movies, $shows, now)),
  );

  const isLoading = combineLatest([isLoadingMovies, isLoadingShows]).pipe(
    map(([$m, $s]) => $m || $s),
  );

  return { data, isLoading };
}
