import { z } from 'zod';
import { MediaEntrySchema } from './MediaEntry.ts';

const YirStatsSchema = z.object({
  total: z.number(),
  yearly: z.number(),
  monthly: z.number(),
  weekly: z.number(),
  daily: z.number(),
});

const YirDistributionsSchema = z.object({
  weekly: z.number().array(),
  monthly: z.number().array(),
  days: z.number().array(),
  hourly: z.number().array().optional(),
});

const YirStatsCategorySchema = z.object({
  minutes: YirStatsSchema,
  playCounts: YirStatsSchema,
  collectedCounts: YirStatsSchema,
  ratingsCounts: YirStatsSchema,
  commentsCounts: YirStatsSchema,
  distributions: YirDistributionsSchema.optional(),
  itemsCount: z.number().optional(),
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
  trends: z.object({
    shows: YirTrendItemSchema.array(),
    movies: YirTrendItemSchema.array(),
  }).nullish(),
  // Popular titles the user hasn't watched yet, recommended in the closing
  // "thanks" section.
  thanks: z.object({
    shows: MediaEntrySchema.array(),
    movies: MediaEntrySchema.array(),
  }).nullish(),
});

export type YirDetail = z.infer<typeof YirDetailSchema>;
export type YirStats = z.infer<typeof YirStatsSchema>;
export type YirStatsCategory = z.infer<typeof YirStatsCategorySchema>;
export type YirDistributions = z.infer<typeof YirDistributionsSchema>;
export type YirGenre = z.infer<typeof YirGenreSchema>;
export type YirGenresGroup = z.infer<typeof YirGenresGroupSchema>;
export type YirCountry = z.infer<typeof YirCountrySchema>;
export type YirCountriesGroup = z.infer<typeof YirCountriesGroupSchema>;
export type YirCompany = z.infer<typeof YirCompanySchema>;
export type YirMostWatchedItem = z.infer<typeof YirMostWatchedItemSchema>;
export type YirTopRatedItem = z.infer<typeof YirTopRatedItemSchema>;
export type YirTrendItem = z.infer<typeof YirTrendItemSchema>;
export type YirWatchedItem = z.infer<typeof YirWatchedItemSchema>;
export type YirWatchedMovie = z.infer<typeof YirWatchedMovieSchema>;
export type YirWatchedEpisode = z.infer<typeof YirWatchedEpisodeSchema>;
