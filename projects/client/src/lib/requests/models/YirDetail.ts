import { z } from 'zod';
import { MediaEntrySchema } from './MediaEntry.ts';

const YirStatsSchema = z.object({
  total: z.number(),
  yearly: z.number(),
  monthly: z.number(),
  weekly: z.number(),
  daily: z.number(),
});

// A single {year, count} datum. Used by the all-time release-years and
// plays-by-year charts, which (unlike the index-based weekly/monthly/day
// buckets) must carry their own year label since the calendar span varies per
// user.
const YirYearCountSchema = z.object({
  year: z.number(),
  count: z.number(),
});

const YirDecadeCountSchema = z.object({
  decade: z.number(),
  count: z.number(),
});

// A single {rating, count} datum (rating 1-10). All-time ratings breakdown.
const YirRatingCountSchema = z.object({
  rating: z.number(),
  count: z.number(),
});

const YirDistributionsSchema = z.object({
  weekly: z.number().array(),
  monthly: z.number().array(),
  days: z.number().array(),
  hourly: z.number().array().optional(),
  // Per-day-of-month buckets (index 0 = 1st). Month in Review only; the
  // monthly stats variant charts plays across the days of the chosen month.
  // Nullish because the API emits it via `&.values` (can be null) and omits it
  // entirely for Year in Review.
  daily: z.number().array().nullish(),
  // Plays per calendar year. All-time view only; self-labelled because the
  // span runs from the user's first watch to now.
  yearly: YirYearCountSchema.array().nullish(),
});

// Subscription streaming services the user watched on during the period, with
// per-type play counts. Month in Review only.
const YirStreamingServiceSchema = z.object({
  source: z.string(),
  name: z.string(),
  shows: z.number(),
  movies: z.number(),
  all: z.number(),
});

const YirStreamingServicesSchema = z.object({
  /** ISO 3166-1 alpha-2 code resolved from the user's watchnow country. */
  country: z.string(),
  services: YirStreamingServiceSchema.array(),
});

const YirStatsCategorySchema = z.object({
  minutes: YirStatsSchema,
  playCounts: YirStatsSchema,
  collectedCounts: YirStatsSchema,
  ratingsCounts: YirStatsSchema,
  commentsCounts: YirStatsSchema,
  distributions: YirDistributionsSchema.optional(),
  itemsCount: z.number().optional(),
  // All-time only: distribution of the user's ratings (1-10) for this type.
  ratingsDistribution: YirRatingCountSchema.array().nullish(),
});

const YirGenreSchema = z.object({
  slug: z.string(),
  name: z.string(),
  count: z.number(),
});

const YirGenresGroupSchema = z.object({
  itemCount: z.number(),
  genres: YirGenreSchema.array(),
});

const YirCountrySchema = z.object({
  /** ISO 3166-1 alpha-2 code (e.g. "us"); the display name is derived in the UI. */
  code: z.string(),
  count: z.number(),
});

const YirCountriesGroupSchema = z.object({
  countryCount: z.number(),
  countries: YirCountrySchema.array(),
});

// All-time only: distribution of watched titles by release year and decade.
const YirReleaseYearsGroupSchema = z.object({
  years: YirYearCountSchema.array(),
  decades: YirDecadeCountSchema.array(),
});

// All-time only: progress through a well-known curated list (e.g. Trakt Top
// 250, IMDB Top 250). Maps to the circular progress charts.
const YirListProgressSchema = z.object({
  id: z.number(),
  /** Asset key for the list's logo (e.g. "trakt", "imdb", "reddit-2018"). */
  site: z.string(),
  title: z.string(),
  /** Fully-resolved logo image URL, or null when the asset is missing. */
  logo: z.string().nullish(),
  total: z.number(),
  watched: z.number(),
  percentage: z.number(),
});

const YirCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.number(),
  imageUrl: z.string().nullish(),
  color: z.string().nullish(),
});

const YirMostWatchedItemSchema = z.object({
  plays: z.number(),
  minutes: z.number(),
  entry: MediaEntrySchema,
});

const YirTopRatedItemSchema = z.object({
  rating: z.number(),
  entry: MediaEntrySchema,
});

const YirTrendItemSchema = z.object({
  /** Calendar month (1-12) the title premiered in. */
  month: z.number(),
  watchers: z.number(),
  watched: z.boolean(),
  entry: MediaEntrySchema,
});

// All-time only: a globally most-watched title, flagged against whether the
// user has watched it. `watchers` is the global all-time play count.
const YirGlobalTopItemSchema = z.object({
  watchers: z.number(),
  watched: z.boolean(),
  entry: MediaEntrySchema,
});

const YirWatchedMovieSchema = z.object({
  type: z.literal('movie'),
  watchedAt: z.date(),
  entry: MediaEntrySchema,
});

const YirWatchedEpisodeSchema = z.object({
  type: z.literal('episode'),
  watchedAt: z.date(),
  entry: MediaEntrySchema,
  episode: z.object({
    title: z.string(),
    season: z.number(),
    number: z.number(),
  }),
});

const YirWatchedItemSchema = z.discriminatedUnion('type', [
  YirWatchedMovieSchema,
  YirWatchedEpisodeSchema,
]);

export const YirDetailSchema = z.object({
  stats: z.object({
    all: YirStatsCategorySchema.merge(z.object({
      listsCounts: YirStatsSchema,
    })),
    shows: YirStatsCategorySchema,
    movies: YirStatsCategorySchema,
  }),
  images: z.object({
    cover: z.string(),
    story: z.string(),
  }),
  firstWatched: YirWatchedItemSchema.nullish(),
  lastWatched: YirWatchedItemSchema.nullish(),
  mostWatched: z.object({
    shows: YirMostWatchedItemSchema.array(),
    movies: YirMostWatchedItemSchema.array(),
  }),
  genres: z.object({
    shows: YirGenresGroupSchema,
    movies: YirGenresGroupSchema,
  }),
  networks: YirCompanySchema.array(),
  studios: YirCompanySchema.array(),
  topRated: z.object({
    shows: YirTopRatedItemSchema.array(),
    movies: YirTopRatedItemSchema.array(),
  }),
  countries: z.object({
    shows: YirCountriesGroupSchema,
    movies: YirCountriesGroupSchema,
  }),
  // All-time only: release-year/decade histograms per type.
  releaseYears: z.object({
    shows: YirReleaseYearsGroupSchema,
    movies: YirReleaseYearsGroupSchema,
  }).nullish(),
  // All-time only: completion progress through curated top lists per type.
  listProgress: z.object({
    shows: YirListProgressSchema.array(),
    movies: YirListProgressSchema.array(),
  }).nullish(),
  trends: z.object({
    shows: YirTrendItemSchema.array(),
    movies: YirTrendItemSchema.array(),
  }).nullish(),
  // All-time only: most-watched titles globally, compared to the user's
  // all-time watched set.
  globalTop: z.object({
    shows: YirGlobalTopItemSchema.array(),
    movies: YirGlobalTopItemSchema.array(),
  }).nullish(),
  // Popular titles the user hasn't watched yet, recommended in the closing
  // "thanks" section.
  thanks: z.object({
    shows: MediaEntrySchema.array(),
    movies: MediaEntrySchema.array(),
  }).nullish(),
  // Month in Review only: subscription services the period's plays were
  // available on.
  streamingServices: YirStreamingServicesSchema.nullish(),
});

export type YirDetail = z.infer<typeof YirDetailSchema>;
export type YirStats = z.infer<typeof YirStatsSchema>;
export type YirStatsCategory = z.infer<typeof YirStatsCategorySchema>;
export type YirDistributions = z.infer<typeof YirDistributionsSchema>;
export type YirGenre = z.infer<typeof YirGenreSchema>;
export type YirGenresGroup = z.infer<typeof YirGenresGroupSchema>;
export type YirCountry = z.infer<typeof YirCountrySchema>;
export type YirCountriesGroup = z.infer<typeof YirCountriesGroupSchema>;
export type YirYearCount = z.infer<typeof YirYearCountSchema>;
export type YirDecadeCount = z.infer<typeof YirDecadeCountSchema>;
export type YirRatingCount = z.infer<typeof YirRatingCountSchema>;
export type YirReleaseYearsGroup = z.infer<typeof YirReleaseYearsGroupSchema>;
export type YirListProgress = z.infer<typeof YirListProgressSchema>;
export type YirCompany = z.infer<typeof YirCompanySchema>;
export type YirMostWatchedItem = z.infer<typeof YirMostWatchedItemSchema>;
export type YirTopRatedItem = z.infer<typeof YirTopRatedItemSchema>;
export type YirTrendItem = z.infer<typeof YirTrendItemSchema>;
export type YirGlobalTopItem = z.infer<typeof YirGlobalTopItemSchema>;
export type YirWatchedItem = z.infer<typeof YirWatchedItemSchema>;
export type YirWatchedMovie = z.infer<typeof YirWatchedMovieSchema>;
export type YirWatchedEpisode = z.infer<typeof YirWatchedEpisodeSchema>;
export type YirStreamingService = z.infer<typeof YirStreamingServiceSchema>;
export type YirStreamingServices = z.infer<typeof YirStreamingServicesSchema>;
