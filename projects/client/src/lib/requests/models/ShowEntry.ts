import { z } from 'zod';
import { EpisodeCountSchema } from './EpisodeCount.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

export const ShowAirsSchema = z.object({
  day: z.string(),
  time: z.string(),
  timezone: z.string(),
});
export type ShowAirs = z.infer<typeof ShowAirsSchema>;

export const ShowEntrySchema = MediaEntrySchema
  .merge(EpisodeCountSchema)
  .merge(z.object({
    airs: ShowAirsSchema.nullish(),
    network: z.string().nullish(),
  }));
export type ShowEntry = z.infer<typeof ShowEntrySchema>;
