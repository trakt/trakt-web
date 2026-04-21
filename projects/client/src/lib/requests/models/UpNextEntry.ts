import { z } from 'zod';
import { EpisodeProgressEntrySchema } from './EpisodeProgressEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const UpNextEntrySchema = EpisodeProgressEntrySchema.merge(
  z.object({
    show: ShowEntrySchema,
    lastWatchedAt: z.date().nullable(),
  }),
);

export type UpNextEntry = z.infer<typeof UpNextEntrySchema>;
