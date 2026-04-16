import { z } from 'zod';

export const ShowProgressSchema = z.object({
  total: z.number(),
  completed: z.number(),
  remaining: z.number(),
  minutesLeft: z.number(),
  lastWatchedAt: z.date().nullable(),
});

export type ShowProgress = z.infer<typeof ShowProgressSchema>;
