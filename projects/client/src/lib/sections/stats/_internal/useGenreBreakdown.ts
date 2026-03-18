import type { MovieActivityHistory } from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import {
  movieActivityHistoryQuery,
} from '$lib/requests/queries/users/movieActivityHistoryQuery.ts';
import type { ShowActivityHistory } from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import {
  showActivityHistoryQuery,
} from '$lib/requests/queries/users/showActivityHistoryQuery.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { usePaginatedListQuery } from '../../lists/stores/usePaginatedListQuery.ts';

type UseGenreBreakdownProps = { slug: string };

export type GenreDayData = {
  date: Date;
  segments: { genre: string; count: number }[];
  total: number;
};

export type GenreLegendEntry = {
  genre: string;
  label: string;
  percentage: number;
  color: string;
};

export type GenreBreakdownData = {
  days: GenreDayData[];
  legend: GenreLegendEntry[];
  maxDayTotal: number;
};

const GENRE_COLORS = [
  '#a87cf0', // purple - slot 1
  '#6ea1f7', // blue - slot 2
  '#4ecdc4', // teal - slot 3
  '#7bc67e', // green - slot 4
  '#f0a04b', // orange - slot 5
  '#555555', // gray - "Other"
];

const HISTORY_LIMIT = 1000;
const TOP_GENRE_COUNT = 5;
const DAY_COUNT = 14;

function genreLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function computeGenreBreakdown(
  movies: MovieActivityHistory[],
  shows: ShowActivityHistory[],
): GenreBreakdownData {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Build 14-day range (today through 13 days ago)
  const days: Date[] = [];
  for (let i = DAY_COUNT - 1; i >= 0; i--) {
    days.push(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - i),
    );
  }

  const rangeStart = days[0] ?? today;
  const rangeEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  // Collect all entries within the 14-day range, using up to 3 genres each
  const GENRES_PER_ENTRY = 2;
  type GenreEntry = { watchedAt: Date; genre: string };
  const genreEntries: GenreEntry[] = [];

  for (const entry of movies) {
    if (entry.watchedAt >= rangeStart && entry.watchedAt < rangeEnd) {
      const genres = entry.movie.genres.slice(0, GENRES_PER_ENTRY);
      if (genres.length === 0) genres.push('other');
      for (const genre of genres) {
        genreEntries.push({ watchedAt: entry.watchedAt, genre });
      }
    }
  }

  for (const entry of shows) {
    if (entry.watchedAt >= rangeStart && entry.watchedAt < rangeEnd) {
      const genres = entry.show.genres.slice(0, GENRES_PER_ENTRY);
      if (genres.length === 0) genres.push('other');
      for (const genre of genres) {
        genreEntries.push({ watchedAt: entry.watchedAt, genre });
      }
    }
  }

  // Count genres globally to find top 5
  const globalCounts = new Map<string, number>();
  for (const { genre } of genreEntries) {
    globalCounts.set(genre, (globalCounts.get(genre) ?? 0) + 1);
  }

  const sortedGenres = [...globalCounts.entries()]
    .sort((a, b) => b[1] - a[1]);

  const topGenres = sortedGenres
    .slice(0, TOP_GENRE_COUNT)
    .map(([genre]) => genre);

  const topGenreSet = new Set(topGenres);

  // Determine consistent genre order (top genres + "other")
  const genreOrder = [...topGenres];
  const hasOther = sortedGenres.length > TOP_GENRE_COUNT ||
    topGenreSet.has('other');
  if (hasOther && !topGenreSet.has('other')) {
    genreOrder.push('other');
  }

  // Group entries by day
  const dayGenreCounts = new Map<string, Map<string, number>>();
  for (const day of days) {
    dayGenreCounts.set(getDayKey(day), new Map());
  }

  for (const { watchedAt, genre } of genreEntries) {
    const key = getDayKey(watchedAt);
    const dayCounts = dayGenreCounts.get(key);
    if (!dayCounts) continue;

    const effectiveGenre = topGenreSet.has(genre) ? genre : 'other';
    dayCounts.set(effectiveGenre, (dayCounts.get(effectiveGenre) ?? 0) + 1);
  }

  // Build day data
  let maxDayTotal = 0;
  const dayData: GenreDayData[] = days.map((date) => {
    const dayCounts = dayGenreCounts.get(getDayKey(date)) ?? new Map<string, number>();
    const segments = genreOrder.map((genre) => ({
      genre,
      count: dayCounts.get(genre) ?? 0,
    }));
    const total = segments.reduce((sum, s) => sum + s.count, 0);
    if (total > maxDayTotal) maxDayTotal = total;
    return { date, segments, total };
  });

  // Build legend
  const totalEntries = genreEntries.length;
  const legend: GenreLegendEntry[] = genreOrder.map((genre, i) => {
    const count = genre === 'other'
      ? sortedGenres
        .filter(([g]) => !topGenreSet.has(g))
        .reduce((sum, [, c]) => sum + c, 0) +
        (topGenreSet.has('other') ? (globalCounts.get('other') ?? 0) : 0)
      : (globalCounts.get(genre) ?? 0);

    return {
      genre,
      label: genre === 'other' ? 'Other' : genreLabel(genre),
      percentage: totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0,
      color: GENRE_COLORS[Math.min(i, GENRE_COLORS.length - 1)] ?? '#555555',
    };
  });

  return { days: dayData, legend, maxDayTotal };
}

export function useGenreBreakdown({ slug }: UseGenreBreakdownProps): {
  data: Observable<GenreBreakdownData>;
  isLoading: Observable<boolean>;
} {
  // Cache-aligned params — identical to useStreak.ts:88-117
  const now = new Date();
  const startDate = new Date(
    Date.UTC(
      now.getUTCFullYear() - 1,
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );
  const endDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    ),
  );

  const params = {
    limit: HISTORY_LIMIT,
    slug,
    startDate,
    endDate,
  };

  const { list: movies, isLoading: isLoadingMovies } = usePaginatedListQuery(
    movieActivityHistoryQuery(params),
  );
  const { list: shows, isLoading: isLoadingShows } = usePaginatedListQuery(
    showActivityHistoryQuery(params),
  );

  const data = combineLatest([movies, shows]).pipe(
    map(([$movies, $shows]) => computeGenreBreakdown($movies, $shows)),
  );

  const isLoading = combineLatest([isLoadingMovies, isLoadingShows]).pipe(
    map(([$m, $s]) => $m || $s),
  );

  return { data, isLoading };
}
