import { z } from 'zod';
import { EpisodeCountSchema } from './EpisodeCount.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

export const ShowAirsSchema = z.object({
  day: z.string(),
  time: z.string(),
  timezone: z.string(),
});
export type ShowAirs = z.infer<typeof ShowAirsSchema>;

export const ShowEndingSchema = z.enum(['concluded', 'open']);
export type ShowEnding = z.infer<typeof ShowEndingSchema>;

export const ShowEntrySchema = MediaEntrySchema.merge(EpisodeCountSchema)
  .extend({
    network: z.string().nullish(),
    totalRuntime: z.number(),
    airs: ShowAirsSchema.nullish(),
    lastAired: z.date().nullish(),
    ending: ShowEndingSchema.nullish(),
  });
export type ShowEntry = z.infer<typeof ShowEntrySchema>;
