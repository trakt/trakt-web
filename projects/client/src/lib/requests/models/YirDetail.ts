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

const YirWatchedItemSchema = z.object({
  type: z.enum(['episode', 'movie']),
  watchedAt: z.date(),
  entry: MediaEntrySchema,
  episodeTitle: z.string().nullish(),
});

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
  productionCompanies: YirCompanySchema.array(),
  topRated: z.object({
    shows: YirTopRatedItemSchema.array(),
    movies: YirTopRatedItemSchema.array(),
  }),
});

export type YirDetail = z.infer<typeof YirDetailSchema>;
export type YirStats = z.infer<typeof YirStatsSchema>;
export type YirStatsCategory = z.infer<typeof YirStatsCategorySchema>;
export type YirDistributions = z.infer<typeof YirDistributionsSchema>;
export type YirGenre = z.infer<typeof YirGenreSchema>;
export type YirGenresGroup = z.infer<typeof YirGenresGroupSchema>;
export type YirCompany = z.infer<typeof YirCompanySchema>;
export type YirMostWatchedItem = z.infer<typeof YirMostWatchedItemSchema>;
export type YirTopRatedItem = z.infer<typeof YirTopRatedItemSchema>;
export type YirWatchedItem = z.infer<typeof YirWatchedItemSchema>;
