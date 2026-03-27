import { z } from 'zod';
import { EpisodeCountSchema } from './EpisodeCount.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

export const ShowEntrySchema = MediaEntrySchema.merge(EpisodeCountSchema)
  .extend({
    network: z.string().nullish(),
    totalRuntime: z.number(),
  });
export type ShowEntry = z.infer<typeof ShowEntrySchema>;
