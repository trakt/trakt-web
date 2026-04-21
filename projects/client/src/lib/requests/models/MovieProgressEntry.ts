import z from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';

export const MovieProgressSchema = MovieEntrySchema.merge(z.object({
  progress: z.number(),
  minutesElapsed: z.number(),
  minutesLeft: z.number(),
  playbackId: z.number(),
  lastWatchedAt: z.date().nullable(),
}));

export type MovieProgressEntry = z.infer<typeof MovieProgressSchema>;
