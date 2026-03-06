import { z } from 'zod';
import { EpisodeProgressEntrySchema } from './EpisodeProgressEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

const UpNextContinueSchema = EpisodeProgressEntrySchema.merge(
  z.object({
    intent: z.literal('continue'),
    show: ShowEntrySchema,
    lastWatchedAt: z.date().nullable(),
  }),
);

const UpNextStartSchema = ShowEntrySchema.merge(
  z.object({
    intent: z.literal('start'),
    episode: z.object({
      count: z.number(),
      season: z.number(),
      number: z.number(),
    }),
  }),
);

export const UpNextEntryNitroSchema = z.discriminatedUnion('intent', [
  UpNextContinueSchema,
  UpNextStartSchema,
]);

export type UpNextEntry = z.infer<typeof UpNextEntryNitroSchema>;
export type UpNextContinueEntry = z.infer<typeof UpNextContinueSchema>;
export type UpNextStartEntry = z.infer<typeof UpNextStartSchema>;
