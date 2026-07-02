import { z } from 'zod';

export const WatchedPlayResponseSchema = z.object({
  id: z.number(),
  watched_at: z.string(),
});

export type WatchedPlayResponse = z.infer<typeof WatchedPlayResponseSchema>;
