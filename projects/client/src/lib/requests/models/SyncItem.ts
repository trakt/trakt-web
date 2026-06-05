import { z } from 'zod';

export const SyncItemTraktReferenceSchema = z.object({
  label: z.string(),
  url: z.string().nullish(),
});

export const SyncItemSchema = z.object({
  key: z.string(),
  kind: z.enum(['history', 'rating']),
  type: z.enum(['movie', 'episode', 'show']).nullish(),
  serviceId: z.string().nullish(),
  contentId: z.string().nullish(),
  tmdbId: z.number().nullish(),
  tmdbSeriesId: z.number().nullish(),
  watchedAt: z.date().nullish(),
  ratedAt: z.date().nullish(),
  progress: z.number().nullish(),
  ratingValue: z.number().nullish(),
  traktItem: SyncItemTraktReferenceSchema.nullish(),
});

export type SyncItem = z.infer<typeof SyncItemSchema>;
export type SyncItemTraktReference = z.infer<
  typeof SyncItemTraktReferenceSchema
>;
