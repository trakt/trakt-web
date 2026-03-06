import z from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';

const MovieContinueSchema = MovieEntrySchema.merge(z.object({
  intent: z.literal('continue'),
  progress: z.number(),
  minutesElapsed: z.number(),
  minutesLeft: z.number(),
  playbackId: z.number(),
  lastWatchedAt: z.date().nullable(),
}));

const MovieStartSchema = MovieEntrySchema.merge(z.object({
  intent: z.literal('start'),
}));

export const MovieProgressSchema = z.discriminatedUnion('intent', [
  MovieContinueSchema,
  MovieStartSchema,
]);

export type MovieProgressEntry = z.infer<typeof MovieProgressSchema>;
export type MovieContinueEntry = z.infer<typeof MovieContinueSchema>;
export type MovieStartEntry = z.infer<typeof MovieStartSchema>;
