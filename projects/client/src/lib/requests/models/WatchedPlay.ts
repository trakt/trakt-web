import { z } from 'zod';

export const WatchedPlaySchema = z.object({
  id: z.number(),
  watchedAt: z.date(),
});

export type WatchedPlay = z.infer<typeof WatchedPlaySchema>;
