import { z } from 'zod';

export const SyncCountsSchema = z.object({
  movies: z.number().nullish(),
  episodes: z.number().nullish(),
  shows: z.number().nullish(),
  seasons: z.number().nullish(),
});

export type SyncCounts = z.infer<typeof SyncCountsSchema>;

export const DataSyncSchema = z.object({
  id: z.number(),
  key: z.string(),
  createdAt: z.date(),
  kind: z.enum(['younify', 'plex', 'import']),
  source: z.string().nullish(),
  application: z.string().nullish(),
  isUndone: z.boolean(),
  undoneAt: z.date().nullish(),
  items: z.object({
    history: SyncCountsSchema.nullish(),
    library: SyncCountsSchema.nullish(),
    ratings: SyncCountsSchema.nullish(),
    watchlist: SyncCountsSchema.nullish(),
  }),
  pausedCount: z.number(),
  skippedCount: z.number(),
});

export type DataSync = z.infer<typeof DataSyncSchema>;
