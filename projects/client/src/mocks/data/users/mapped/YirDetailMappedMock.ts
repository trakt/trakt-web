import type {
  YirDetail,
  YirStatsCategory,
} from '$lib/requests/models/YirDetail.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowDevsMappedMock } from '$mocks/data/summary/shows/devs/ShowDevsMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';

const silo: MediaEntry = ShowSiloMappedMock;
const devs: MediaEntry = ShowDevsMappedMock;
const heretic: MediaEntry = MovieHereticMappedMock;
const matrix: MediaEntry = MovieMatrixMappedMock;

const EMPTY_STATS = { total: 0, yearly: 0, monthly: 0, weekly: 0, daily: 0 };

function stats(plays: number): YirStatsCategory {
  return {
    minutes: { ...EMPTY_STATS, total: plays * 45 },
    playCounts: { ...EMPTY_STATS, total: plays },
    collectedCounts: EMPTY_STATS,
    ratingsCounts: EMPTY_STATS,
    commentsCounts: EMPTY_STATS,
    itemsCount: plays > 0 ? 2 : 0,
  };
}

export const YirDetailMappedMock: YirDetail = {
  stats: {
    all: { ...stats(30), listsCounts: EMPTY_STATS },
    shows: stats(24),
    movies: stats(6),
  },
  images: { cover: '', story: '' },
  firstWatched: {
    type: 'episode',
    watchedAt: new Date('2026-01-02T00:43:00Z'),
    entry: silo,
    episode: { title: 'Freedom Day', season: 1, number: 1 },
  },
  lastWatched: {
    type: 'movie',
    watchedAt: new Date('2026-09-25T21:10:00Z'),
    entry: heretic,
  },
  mostWatched: {
    shows: [
      { plays: 14, minutes: 700, entry: silo },
      { plays: 10, minutes: 500, entry: devs },
    ],
    movies: [
      { plays: 4, minutes: 440, entry: heretic },
      { plays: 2, minutes: 270, entry: matrix },
    ],
  },
  genres: {
    shows: {
      itemCount: 2,
      genres: [{ slug: 'drama', name: 'drama', count: 2 }],
    },
    movies: {
      itemCount: 2,
      genres: [{ slug: 'horror', name: 'horror', count: 1 }],
    },
  },
  networks: [{ id: 1, name: 'Apple TV+', count: 2, imageUrl: null }],
  studios: [],
  topRated: {
    shows: [{ rating: 9, entry: silo }],
    movies: [{ rating: 8, entry: heretic }],
  },
  countries: {
    shows: { countryCount: 1, countries: [{ code: 'us', count: 2 }] },
    movies: { countryCount: 0, countries: [] },
  },
  trends: {
    shows: [{ month: 5, watchers: 1200, watched: true, entry: devs }],
    movies: [],
  },
  thanks: { shows: [devs], movies: [matrix] },
};
