import { z } from 'zod';

export const MediaPlayHistorySchema = z.object({
  watchedAt: z.date(),
  plays: z.number(),
});
export type MediaPlayHistory = z.infer<typeof MediaPlayHistorySchema>;

export const WatchedMediaSchema = MediaPlayHistorySchema.extend({
  id: z.number(),
});
