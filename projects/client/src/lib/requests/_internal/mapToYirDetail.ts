import type { MovieResponse, ShowResponse } from '@trakt/api';
import type {
  YirCompany,
  YirCountriesGroup,
  YirDetail,
  YirGenresGroup,
  YirGlobalTopItem,
  YirListProgress,
  YirMostWatchedItem,
  YirStatsCategory,
  YirStreamingServices,
  YirTopRatedItem,
  YirTrendItem,
  YirWatchedItem,
} from '../models/YirDetail.ts';
import type { MediaEntry } from '../models/MediaEntry.ts';
import { mapToMovieEntry } from './mapToMovieEntry.ts';
import { mapToShowEntry } from './mapToShowEntry.ts';
import { appendWebp } from '$lib/utils/url/appendWebp.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';

type RawStats = {
  total: number;
  yearly: number;
  monthly: number;
  weekly: number;
  daily: number;
};

type RawYearCount = { year: number; count: number };
type RawDecadeCount = { decade: number; count: number };
type RawRatingCount = { rating: number; count: number };

type RawDistributions = {
  weekly: number[];
  monthly: number[];
  days: number[];
  hourly?: number[];
  daily?: number[] | null;
  yearly?: RawYearCount[] | null;
};

type RawReleaseYearsGroup = {
  years: RawYearCount[];
  decades: RawDecadeCount[];
};

type RawListProgress = {
  id: number;
  site: string;
  title: string;
  logo?: string | null;
  total: number;
  watched: number;
  percentage: number;
};

type RawStatsCategory = {
  minutes: RawStats;
  play_counts: RawStats;
  collected_counts: RawStats;
  ratings_counts: RawStats;
  comments_counts: RawStats;
  distributions?: RawDistributions;
  items_count?: number;
  ratings_distribution?: RawRatingCount[] | null;
};

type RawWatchedItem = {
  type: 'episode' | 'movie';
  watched_at: string;
  show?: ShowResponse;
  movie?: MovieResponse;
  episode?: { title: string; season: number; number: number };
};

type RawMostWatchedShow = {
  plays: number;
  minutes: number;
  show: ShowResponse;
};

type RawMostWatchedMovie = {
  plays: number;
  minutes: number;
  movie: MovieResponse;
};

type RawGenresGroup = {
  item_count: number;
  genres: Array<{ slug: string; name: string; count: number }>;
};

type RawCompany = {
  id: number;
  name: string;
  count: number;
  image_url?: string | null;
  color?: string | null;
};

type RawCountriesGroup = {
  country_count: number;
  countries: Array<{ country: string; count: number }>;
};

type RawTopRatedShow = {
  rating: number;
  show: ShowResponse;
};

type RawTopRatedMovie = {
  rating: number;
  movie: MovieResponse;
};

type RawTrendShow = {
  month: number;
  watchers: number;
  watched: boolean;
  show: ShowResponse;
};

type RawTrendMovie = {
  month: number;
  watchers: number;
  watched: boolean;
  movie: MovieResponse;
};

type RawGlobalTopShow = {
  watchers: number;
  watched: boolean;
  show: ShowResponse;
};

type RawGlobalTopMovie = {
  watchers: number;
  watched: boolean;
  movie: MovieResponse;
};

type RawThanks = {
  shows?: Array<{ show: ShowResponse }>;
  movies?: Array<{ movie: MovieResponse }>;
};

type RawStreamingServices = {
  country: string;
  services: Array<{
    source: string;
    name: string;
    shows: number;
    movies: number;
    all: number;
  }>;
};

export type RawYirResponse = {
  stats: {
    all: RawStatsCategory & { lists_counts: RawStats };
    shows: RawStatsCategory;
    movies: RawStatsCategory;
  };
  images: {
    cover: string;
    story: string;
  };
  first_watched: RawWatchedItem | null;
  last_watched: RawWatchedItem | null;
  most_watched: {
    shows: RawMostWatchedShow[];
    movies: RawMostWatchedMovie[];
  };
  genres: {
    shows: RawGenresGroup;
    movies: RawGenresGroup;
  };
  networks: RawCompany[];
  production_companies: RawCompany[];
  top_rated: {
    shows: RawTopRatedShow[];
    movies: RawTopRatedMovie[];
  };
  countries?: {
    shows: RawCountriesGroup;
    movies: RawCountriesGroup;
  };
  release_years?: {
    shows: RawReleaseYearsGroup;
    movies: RawReleaseYearsGroup;
  } | null;
  list_progress?: {
    shows: RawListProgress[];
    movies: RawListProgress[];
  } | null;
  trends?: {
    shows: RawTrendShow[];
    movies: RawTrendMovie[];
  };
  global_top?: {
    shows: RawGlobalTopShow[];
    movies: RawGlobalTopMovie[];
  } | null;
  thanks?: RawThanks;
  streaming_services?: RawStreamingServices | null;
};

function mapStatsCategory(raw: RawStatsCategory): YirStatsCategory {
  return {
    minutes: raw.minutes,
    playCounts: raw.play_counts,
    collectedCounts: raw.collected_counts,
    ratingsCounts: raw.ratings_counts,
    commentsCounts: raw.comments_counts,
    distributions: raw.distributions,
    itemsCount: raw.items_count,
    ratingsDistribution: raw.ratings_distribution ?? undefined,
  };
}

function mapWatchedItemEntry(raw: RawWatchedItem) {
  if (raw.type === 'episode' && raw.show) return mapToShowEntry(raw.show);
  if (raw.movie) return mapToMovieEntry(raw.movie);
  return null;
}

function mapWatchedItem(raw: RawWatchedItem | null): YirWatchedItem | null {
  if (!raw) return null;

  const entry = mapWatchedItemEntry(raw);
  if (!entry) return null;

  const item = {
    type: raw.type,
    watchedAt: new Date(raw.watched_at),
    entry,
  } as YirWatchedItem;

  if (item.type === 'episode') {
    if (!raw.episode) return null;
    item.episode = raw.episode;
  }

  return item;
}

function mapMostWatchedShows(
  raw: RawMostWatchedShow[],
): YirMostWatchedItem[] {
  return raw.map((item) => ({
    plays: item.plays,
    minutes: item.minutes,
    entry: mapToShowEntry(item.show),
  }));
}

function mapMostWatchedMovies(
  raw: RawMostWatchedMovie[],
): YirMostWatchedItem[] {
  return raw.map((item) => ({
    plays: item.plays,
    minutes: item.minutes,
    entry: mapToMovieEntry(item.movie),
  }));
}

function mapGenresGroup(raw: RawGenresGroup): YirGenresGroup {
  return {
    itemCount: raw.item_count,
    genres: raw.genres,
  };
}

function mapCompanies(raw: RawCompany[]): YirCompany[] {
  return raw.map((item) => ({
    id: item.id,
    name: item.name,
    count: item.count,
    imageUrl: item.image_url ? appendWebp(prependHttps(item.image_url)) : null,
    color: item.color,
  }));
}

function mapCountriesGroup(raw: RawCountriesGroup): YirCountriesGroup {
  return {
    countryCount: raw.country_count,
    countries: (raw.countries ?? []).map((item) => ({
      code: item.country,
      count: item.count,
    })),
  };
}

function mapTopRatedShows(raw: RawTopRatedShow[]): YirTopRatedItem[] {
  return raw.map((item) => ({
    rating: item.rating,
    entry: mapToShowEntry(item.show),
  }));
}

function mapTopRatedMovies(raw: RawTopRatedMovie[]): YirTopRatedItem[] {
  return raw.map((item) => ({
    rating: item.rating,
    entry: mapToMovieEntry(item.movie),
  }));
}

function mapTrendShows(raw: RawTrendShow[]): YirTrendItem[] {
  return raw.map((item) => ({
    month: item.month,
    watchers: item.watchers,
    watched: item.watched,
    entry: mapToShowEntry(item.show),
  }));
}

function mapTrendMovies(raw: RawTrendMovie[]): YirTrendItem[] {
  return raw.map((item) => ({
    month: item.month,
    watchers: item.watchers,
    watched: item.watched,
    entry: mapToMovieEntry(item.movie),
  }));
}

function mapGlobalTopShows(raw: RawGlobalTopShow[]): YirGlobalTopItem[] {
  return raw.map((item) => ({
    watchers: item.watchers,
    watched: item.watched,
    entry: mapToShowEntry(item.show),
  }));
}

function mapGlobalTopMovies(raw: RawGlobalTopMovie[]): YirGlobalTopItem[] {
  return raw.map((item) => ({
    watchers: item.watchers,
    watched: item.watched,
    entry: mapToMovieEntry(item.movie),
  }));
}

function mapThanks(
  raw: RawThanks,
): { shows: MediaEntry[]; movies: MediaEntry[] } {
  return {
    shows: raw.shows?.map((item) => mapToShowEntry(item.show)) ?? [],
    movies: raw.movies?.map((item) => mapToMovieEntry(item.movie)) ?? [],
  };
}

function mapStreamingServices(
  raw: RawStreamingServices | null | undefined,
): YirStreamingServices | undefined {
  if (!raw) return undefined;

  return {
    country: raw.country,
    services: raw.services.map((service) => ({
      source: service.source,
      name: service.name,
      shows: service.shows,
      movies: service.movies,
      all: service.all,
    })),
  };
}

function mapListProgress(raw: RawListProgress[]): YirListProgress[] {
  return raw.map((item) => ({
    ...item,
    // The API returns a protocol-less asset URL; ensure it's absolute.
    logo: item.logo ? prependHttps(item.logo) : null,
  }));
}

export function mapToYirDetail(response: RawYirResponse): YirDetail {
  const { stats, images } = response;

  return {
    stats: {
      all: {
        ...mapStatsCategory(stats.all),
        listsCounts: stats.all.lists_counts,
      },
      shows: mapStatsCategory(stats.shows),
      movies: mapStatsCategory(stats.movies),
    },
    images: {
      cover: appendWebp(prependHttps(images.cover)) ?? images.cover,
      story: appendWebp(prependHttps(images.story)) ?? images.story,
    },
    firstWatched: mapWatchedItem(response.first_watched),
    lastWatched: mapWatchedItem(response.last_watched),
    mostWatched: {
      shows: mapMostWatchedShows(response.most_watched?.shows ?? []),
      movies: mapMostWatchedMovies(response.most_watched?.movies ?? []),
    },
    genres: {
      shows: mapGenresGroup(
        response.genres?.shows ?? { item_count: 0, genres: [] },
      ),
      movies: mapGenresGroup(
        response.genres?.movies ?? { item_count: 0, genres: [] },
      ),
    },
    networks: mapCompanies(response.networks ?? []),
    studios: mapCompanies(response.production_companies ?? []),
    topRated: {
      shows: mapTopRatedShows(response.top_rated?.shows ?? []),
      movies: mapTopRatedMovies(response.top_rated?.movies ?? []),
    },
    countries: {
      shows: mapCountriesGroup(
        response.countries?.shows ?? { country_count: 0, countries: [] },
      ),
      movies: mapCountriesGroup(
        response.countries?.movies ?? { country_count: 0, countries: [] },
      ),
    },
    releaseYears: response.release_years
      ? {
        shows: response.release_years.shows ?? { years: [], decades: [] },
        movies: response.release_years.movies ?? { years: [], decades: [] },
      }
      : undefined,
    listProgress: response.list_progress
      ? {
        shows: mapListProgress(response.list_progress.shows ?? []),
        movies: mapListProgress(response.list_progress.movies ?? []),
      }
      : undefined,
    trends: {
      shows: mapTrendShows(response.trends?.shows ?? []),
      movies: mapTrendMovies(response.trends?.movies ?? []),
    },
    globalTop: response.global_top
      ? {
        shows: mapGlobalTopShows(response.global_top.shows ?? []),
        movies: mapGlobalTopMovies(response.global_top.movies ?? []),
      }
      : undefined,
    thanks: mapThanks(response.thanks ?? {}),
    streamingServices: mapStreamingServices(response.streaming_services),
  };
}
