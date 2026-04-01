import type { MovieResponse, ShowResponse } from '@trakt/api';
import type {
  YirCompany,
  YirDetail,
  YirGenresGroup,
  YirMostWatchedItem,
  YirStatsCategory,
  YirTopRatedItem,
  YirWatchedItem,
} from '../models/YirDetail.ts';
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

type RawDistributions = {
  weekly: number[];
  monthly: number[];
  days: number[];
  hourly?: number[];
};

type RawStatsCategory = {
  minutes: RawStats;
  play_counts: RawStats;
  collected_counts: RawStats;
  ratings_counts: RawStats;
  comments_counts: RawStats;
  distributions?: RawDistributions;
  items_count?: number;
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

type RawTopRatedShow = {
  rating: number;
  show: ShowResponse;
};

type RawTopRatedMovie = {
  rating: number;
  movie: MovieResponse;
};

type RawYirResponse = {
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

  return {
    type: raw.type,
    watchedAt: raw.watched_at,
    entry,
    episodeTitle: raw.episode?.title,
  };
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
    imageUrl: item.image_url
      ? appendWebp(prependHttps(item.image_url))
      : null,
    color: item.color,
  }));
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
    productionCompanies: mapCompanies(response.production_companies ?? []),
    topRated: {
      shows: mapTopRatedShows(response.top_rated?.shows ?? []),
      movies: mapTopRatedMovies(response.top_rated?.movies ?? []),
    },
  };
}
